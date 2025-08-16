// Package models defines the data structures used in the application.
package models

import "gorm.io/gorm"

type User struct {
 ID       uint   `gorm:"primaryKey" json:"id"`
 Username string `gorm:"unique;not null" json:"username"`
 Password string `gorm:"not null" json:"password"`
 IsAdmin  bool   `gorm:"default:false" json:"isAdmin"` // Indicates if the user is an admin
 Avatar   string `gorm:"type:varchar(255)" json:"avatar"` // URL for the user's avatar
}

func Migrate(db *gorm.DB) {
	db.AutoMigrate(&User{})
}
