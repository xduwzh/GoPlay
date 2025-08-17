package controllers

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gin-gonic/gin"
)

type presignRequest struct {
    Filename    string `json:"filename"`
    ContentType string `json:"contentType"`
}

// AvatarPresign returns a presigned PUT URL and the eventual public URL for the avatar
func AvatarPresign(c *gin.Context) {
    // Auth: need user context
    uid, ok := c.Get("userID")
    if !ok {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }

    var req presignRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
        return
    }
    if req.Filename == "" || req.ContentType == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "filename and contentType are required"})
        return
    }
    if !strings.HasPrefix(req.ContentType, "image/") {
        c.JSON(http.StatusBadRequest, gin.H{"error": "only image content types are allowed"})
        return
    }

    bucket := os.Getenv("S3_BUCKET")
    if bucket == "" {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "S3_BUCKET not configured"})
        return
    }
    region := os.Getenv("AWS_REGION")
    if region == "" {
        region = "eu-north-1"
    }

    // sanitize filename
    base := filepath.Base(req.Filename)
    base = strings.ReplaceAll(base, " ", "_")
    key := fmt.Sprintf("avatars/%v/%d_%s", uid, time.Now().Unix(), base)

    // AWS SDK config (credentials from env)
    cfg, err := config.LoadDefaultConfig(context.Background(), config.WithRegion(region))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to load AWS config"})
        return
    }
    s3Client := s3.NewFromConfig(cfg)
    presigner := s3.NewPresignClient(s3Client)

    putInput := &s3.PutObjectInput{
        Bucket:      &bucket,
        Key:         &key,
        ContentType: &req.ContentType,
        // Note: ACL not set here; ensure bucket policy/cors allows reads as needed.
    }
    presigned, err := presigner.PresignPutObject(context.Background(), putInput, s3.WithPresignExpires(15*time.Minute))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to presign"})
        return
    }

    publicURL := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", bucket, region, key)

    c.JSON(http.StatusOK, gin.H{
        "uploadUrl":  presigned.URL,
        "publicUrl":  publicURL,
        "expiresIn":  900,
        "contentType": req.ContentType,
        "key":        key,
    })
}
