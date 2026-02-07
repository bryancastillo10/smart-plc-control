package models

import (
	"time"

	"github.com/google/uuid"
)

type Plant struct {
	ID          uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	Name        string    `gorm:"type:varchar(100);not null" json:"name"`
	Location    string    `gorm:"type:varchar(100);not null" json:"location"`
	Description *string   `gorm:"type:varchar(100)" json:"description,omitempty"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`

	Settings PlantSettings  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"settings"`
	Valves   []Valve        `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"valves"`
	Sensors  []SensorConfig `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"sensors"`
}
