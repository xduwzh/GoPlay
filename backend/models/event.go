package models

import (
	"time"

	"github.com/lib/pq"
)

// Event represents an activity or event in the system
type Event struct {
	ID                  uint      `gorm:"primaryKey" json:"id"`
	Name                string    `gorm:"not null" json:"name"` // Name of the event
	Description         string    `gorm:"type:text" json:"description"` // Description of the event
	Date                string    `gorm:"not null" json:"date"` // Date of the event
	Time                string    `gorm:"not null" json:"time"` // Time of the event (e.g., "14:00")
	Location            string    `gorm:"not null" json:"location"` // Location of the event
	MaxPlayers          int       `gorm:"not null" json:"maxPlayers"` // Maximum number of players allowed
	RegisteredPlayers   pq.StringArray  `gorm:"type:text[]" json:"registeredPlayers"` // List of registered players (Postgres array)
	WaitingListPlayers  pq.StringArray  `gorm:"type:text[]" json:"waitingListPlayers"` // List of players on the waiting list (Postgres array)
	CreatedAt           time.Time `json:"createdAt"` // Timestamp when the event was created
	UpdatedAt           time.Time `json:"updatedAt"` // Timestamp when the event was last updated
}


