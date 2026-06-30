package models

import (
	"time"

	"github.com/google/uuid"
)

type ProcessUnits struct {
	ID          uuid.UUID   `gorm:"primaryKey;type:uuid" json:"id"`
	PlantID     uuid.UUID   `gorm:"type:uuid;not null;index;uniqueIndex:idx_process_units_plant_name" json:"plantId"`
	Plant       *Plants     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Name        string      `gorm:"type:varchar(120);not null;uniqueIndex:idx_process_units_plant_name" json:"name"`
	Type        string      `gorm:"type:varchar(80);not null" json:"type"`
	Description string      `gorm:"type:text" json:"description"`
	Status      PlantStatus `gorm:"type:varchar(20);not null;default:ACTIVE" json:"status"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
