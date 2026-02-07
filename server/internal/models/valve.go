package models

import (
	"time"

	"github.com/google/uuid"
)

type Valve struct {
	ID      uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	PlantID uuid.UUID `gorm:"type:uuid;not null;index" json:"plantId"`

	Name        string  `gorm:"type:varchar(100);not null" json:"name"`
	Location    string  `gorm:"type:varchar(100)" json:"location"`
	Description *string `gorm:"type:varchar(255)" json:"description,omitempty"`

	Position float64 `gorm:"not null" json:"position"`
	IsAuto   bool    `gorm:"not null;default:true" json:"isAuto"`

	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`

	SensorConfigs []SensorConfig `gorm:"foreignKey:ValveID" json:"sensorConfigs"`
}
