package models

import (
	"github.com/google/uuid"
)

type SensorConfig struct {
	ID      uuid.UUID  `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	PlantID uuid.UUID  `gorm:"type:uuid;not null;index" json:"plantId"`
	ValveID *uuid.UUID `gorm:"type:uuid;index" json:"valveId,omitempty"`

	Sensor string `gorm:"type:varchar(50);not null;index" json:"sensor"`

	BaseMin     float64 `gorm:"not null" json:"baseMin"`
	BaseMax     float64 `gorm:"not null" json:"baseMax"`
	EffectScale float64 `gorm:"not null" json:"effectScale"`
}
