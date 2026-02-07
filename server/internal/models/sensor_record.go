package models

import (
	"time"

	"github.com/google/uuid"
)

type SensorRecord struct {
	ID uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`

	PlantID    uuid.UUID  `gorm:"type:uuid;not null;index" json:"plantId"`
	RecordedBy *uuid.UUID `gorm:"type:uuid;index" json:"recordedBy,omitempty"`

	MonitoringDate time.Time `gorm:"autoCreateTime;index" json:"monitoringDate"`
	Sensor         string    `gorm:"type:varchar(50);not null;index" json:"sensor"`

	Value float64 `gorm:"not null" json:"value"`
}
