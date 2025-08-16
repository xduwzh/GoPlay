// Package database provides the database connection and migration functions.
package database

import (
	"LetsMatch/backend/models"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDatabase() {
    // Load environment variables
    if err := godotenv.Load(".env"); err != nil {
        log.Fatal("Error loading .env file")
    }

    var err error
    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
        os.Getenv("POSTGRES_HOST"),
        os.Getenv("POSTGRES_USER"),
        os.Getenv("POSTGRES_PASSWORD"),
        os.Getenv("POSTGRES_DB"),
        os.Getenv("POSTGRES_PORT"),
    )
    DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("Failed to connect to database: ", err)
    }

    DB.AutoMigrate(&models.User{})
    DB.AutoMigrate(&models.Event{})
}