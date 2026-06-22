package models

import (
	"time"

	"github.com/google/uuid"
)

type Users struct {
	ID       uuid.UUID `gorm:"primaryKey;type:uuid" json:"id"`
	UserName string    `gorm:"type:varchar(100);not null" json:"userName"`
	Email    string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	Password string    `gorm:"not null" json:"password"`
	Language Language  `gorm:"type:varchar(20);not null;default:EN" json:"language"`
	Role     Role      `gorm:"type:varchar(20)" json:"role"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
