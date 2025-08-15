package main

import (
	"LetsMatch/backend/database"
	"LetsMatch/backend/routes"
)

func main() {
	database.InitDatabase()
	r := routes.SetupRoutes()
	r.Run() // Default listens on :8080
}