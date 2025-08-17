package controllers

import (
	"net/http"

	"GoPlay/backend/database"
	"GoPlay/backend/models"

	"github.com/gin-gonic/gin"
)

// CreateEvent handles creating a new event
func CreateEvent(c *gin.Context) {
	var event models.Event
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event created successfully", "event": event})
}

// GetEvents handles fetching all events
func GetEvents(c *gin.Context) {
	var events []models.Event
	if err := database.DB.Find(&events).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch events"})
		return
	}

	c.JSON(http.StatusOK, events)
}

// GetEvent handles fetching a single event by ID
func GetEvent(c *gin.Context) {
	id := c.Param("id")
	var event models.Event
	if err := database.DB.First(&event, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	c.JSON(http.StatusOK, event)
}

// UpdateEvent handles updating an existing event
func UpdateEvent(c *gin.Context) {
	id := c.Param("id")
	var event models.Event
	if err := database.DB.First(&event, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event updated successfully", "event": event})
}

// DeleteEvent handles deleting an event by ID
func DeleteEvent(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.Event{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event deleted successfully"})
}

// RegisterForEvent handles user registration to an event (protected)
func RegisterForEvent(c *gin.Context) {
	// Ensure middleware extracted userID
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Load user to get username
	var user models.User
	if err := database.DB.First(&user, userIDVal).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	// Load event
	id := c.Param("id")
	var event models.Event
	if err := database.DB.First(&event, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	// Check if already registered or in waiting list
	username := user.Username
	for _, u := range event.RegisteredPlayers {
		if u == username {
			c.JSON(http.StatusOK, gin.H{"message": "Already registered", "event": event})
			return
		}
	}
	for _, u := range event.WaitingListPlayers {
		if u == username {
			c.JSON(http.StatusOK, gin.H{"message": "Already in waiting list", "event": event})
			return
		}
	}

	// Add to registered if capacity available; else to waiting list
	if len(event.RegisteredPlayers) < event.MaxPlayers {
		event.RegisteredPlayers = append(event.RegisteredPlayers, username)
		if err := database.DB.Save(&event).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Registered successfully", "event": event})
		return
	}

	event.WaitingListPlayers = append(event.WaitingListPlayers, username)
	if err := database.DB.Save(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to join waiting list"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Event full, added to waiting list", "event": event})
}

// CancelRegistration removes the current user from an event's registered or waiting lists
func CancelRegistration(c *gin.Context) {
	// Ensure middleware extracted userID
	userIDVal, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Load user to get username
	var user models.User
	if err := database.DB.First(&user, userIDVal).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user"})
		return
	}

	// Load event
	id := c.Param("id")
	var event models.Event
	if err := database.DB.First(&event, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Event not found"})
		return
	}

	username := user.Username
	removedFromRegistered := false

	// Remove from registered players if present
	if len(event.RegisteredPlayers) > 0 {
		filtered := event.RegisteredPlayers[:0]
		for _, u := range event.RegisteredPlayers {
			if u != username {
				filtered = append(filtered, u)
			} else {
				removedFromRegistered = true
			}
		}
		event.RegisteredPlayers = filtered
	}

	// Remove from waiting list if present
	if len(event.WaitingListPlayers) > 0 {
		filtered := event.WaitingListPlayers[:0]
		for _, u := range event.WaitingListPlayers {
			if u != username {
				filtered = append(filtered, u)
			}
		}
		event.WaitingListPlayers = filtered
	}

	// If removed from registered and there is someone waiting, promote the first waiter
	if removedFromRegistered && len(event.WaitingListPlayers) > 0 {
		promoted := event.WaitingListPlayers[0]
		event.WaitingListPlayers = event.WaitingListPlayers[1:]
		event.RegisteredPlayers = append(event.RegisteredPlayers, promoted)
	}

	if err := database.DB.Save(&event).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to cancel registration"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Cancelled registration", "event": event})
}
