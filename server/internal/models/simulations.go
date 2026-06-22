package models

import (
	"time"

	"github.com/google/uuid"
)

type Simulations struct {
	ID               uuid.UUID        `gorm:"primaryKey;type:uuid" json:"id"`
	PlantID          uuid.UUID        `gorm:"type:uuid;not null;index" json:"plantId"`
	Name             string           `gorm:"type:varchar(120);not null" json:"name"`
	Status           SimulationStatus `gorm:"type:varchar(20);not null;default:IDLE" json:"status"`
	UpdateIntervalMS int              `gorm:"not null;default:1000" json:"updateIntervalMs"`
	NoiseFactor      float64          `gorm:"type:numeric(5,2);not null;default:0.00" json:"noiseFactor"`
	StartedAt        *time.Time       `gorm:"type:timestamptz" json:"startedAt"`
	PausedAt         *time.Time       `gorm:"type:timestamptz" json:"pausedAt"`
	StoppedAt        *time.Time       `gorm:"type:timestamptz" json:"stoppedAt"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
