package models

import (
	"time"

	"github.com/google/uuid"
)

type PlantSettings struct {
	ID      uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	PlantID uuid.UUID `gorm:"type:uuid;not null;uniqueIndex" json:"plantId"`

	UpdatedBy     uuid.UUID `gorm:"type:uuid;index" json:"updatedBy"`
	UpdatedByUser User      `gorm:"foreignKey:UpdatedBy;references:ID"`

	Interval    int32   `gorm:"not null" json:"interval"`
	NoiseFactor float64 `gorm:"not null" json:"noiseFactor"`

	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
