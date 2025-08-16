package main

import (
	"LetsMatch/backend/database"
	"LetsMatch/backend/routes"
)

func main() {
    r := routes.SetupRoutes() // Use the returned engine from SetupRoutes

    database.InitDatabase()
    r.Run() // Default listens on :8080
}