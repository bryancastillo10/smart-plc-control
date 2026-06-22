package models

import (
	"time"

	"github.com/google/uuid"
)

type Plants struct {
	ID uuid.UUID `gorm:"primaryKey;type:uuid" json:"id"`
	Name  string  `gorm:"type:varchar(120);not null" json:"name"`
	Location  string  `gorm:"type:varchar(200);not null" json:"location"`
	Description string    `gorm:"type:text" json:"description"`
	Status PlantStatus `gorm:"type:varchar(20);not null;default:ACTIVE" json:"status"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}

