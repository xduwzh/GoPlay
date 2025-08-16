package models

import (
	"time"
)

// Event represents an activity or event in the system
type Event struct {
	ID          uint      `gorm:"primaryKey"`
	Name        string    `gorm:"not null"` // Name of the event
	Description string    `gorm:"type:text"` // Description of the event
	Date        string `gorm:"not null"` // Date of the event
	Time        string    `gorm:"not null"` // Time of the event (e.g., "14:00")
	Location    string    `gorm:"not null"` // Location of the event
	MaxPlayers  int       `gorm:"not null"` // Maximum number of players allowed
	CreatedAt   time.Time // Timestamp when the event was created
	UpdatedAt   time.Time // Timestamp when the event was last updated
}


