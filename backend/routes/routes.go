// Package routes defines the application routes.
package routes

import (
	"LetsMatch/backend/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

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
