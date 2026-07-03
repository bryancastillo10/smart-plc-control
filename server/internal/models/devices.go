package models

import (
	"time"

	"github.com/google/uuid"
)

type Devices struct {
	ID               uuid.UUID        `gorm:"primaryKey;type:uuid" json:"id"`
	PlantID          uuid.UUID        `gorm:"type:uuid;not null;index;uniqueIndex:idx_devices_plant_name" json:"plantId"`
	Plant            *Plants          `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Name             string           `gorm:"type:varchar(120);not null;uniqueIndex:idx_devices_plant_name" json:"name"`
	Type             DeviceType       `gorm:"type:varchar(30);not null" json:"type"`
	Description      string           `gorm:"type:text" json:"description"`
	Protocol         Protocol         `gorm:"type:varchar(20);not null" json:"protocol"`
	Host             string           `gorm:"type:varchar(100)" json:"host"`
	Port             *int             `gorm:"type:integer" json:"port"`
	ConnectionStatus ConnectionStatus `gorm:"type:varchar(20);not null;default:DISCONNECTED" json:"connectionStatus"`
	Enabled          bool             `gorm:"not null;default:true" json:"enabled"`
	LastConnectedAt  *time.Time       `gorm:"type:timestamptz" json:"lastConnectedAt"`
	Position         Position         `gorm:"serializer:json;type:jsonb" json:"position"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
