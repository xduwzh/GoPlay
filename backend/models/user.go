// Package models defines the data structures used in the application.
package models

import "gorm.io/gorm"

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Username string `gorm:"unique;not null"`
	Password string `gorm:"not null"`
	IsAdmin  bool   `gorm:"default:false"` // Indicates if the user is an admin
	Avatar   string `gorm:"type:varchar(255)"` // URL for the user's avatar
}

func Migrate(db *gorm.DB) {
	db.AutoMigrate(&User{})
}
