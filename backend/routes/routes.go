// Package routes defines the application routes.
package routes

import (
	"GoPlay/backend/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// Add CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
    }))

	// Auth routes
	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)

	// Event routes
	r.POST("/events", controllers.CreateEvent)
	r.GET("/events", controllers.GetEvents)
	r.GET("/events/:id", controllers.GetEvent)
	r.PUT("/events/:id", controllers.UpdateEvent)
	r.DELETE("/events/:id", controllers.DeleteEvent)

	return r
}
