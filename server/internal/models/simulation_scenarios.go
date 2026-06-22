package models

import (
	"time"

	"github.com/google/uuid"
)

type SimulationScenarios struct {
	ID           uuid.UUID              `gorm:"primaryKey;type:uuid" json:"id"`
	SimulationID uuid.UUID              `gorm:"type:uuid;not null;index" json:"simulationId"`
	Name         string                 `gorm:"type:varchar(120);not null" json:"name"`
	Description  string                 `gorm:"type:text" json:"description"`
	Config       map[string]interface{} `gorm:"type:jsonb;not null;serializer:json" json:"config"`
	Enabled      bool                   `gorm:"not null;default:true" json:"enabled"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
