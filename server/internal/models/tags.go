package models

import (
	"time"

	"github.com/google/uuid"
)

type Tags struct {
	ID             uuid.UUID     `gorm:"primaryKey;type:uuid" json:"id"`
	DeviceID       uuid.UUID     `gorm:"type:uuid;not null;index;uniqueIndex:idx_tags_device_name" json:"deviceId"`
	Device         *Devices      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	ProcessUnitID  *uuid.UUID    `gorm:"type:uuid;index" json:"processUnitId"`
	ProcessUnit    *ProcessUnits `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"-"`
	Name           string        `gorm:"type:varchar(120);not null;uniqueIndex:idx_tags_device_name" json:"name"`
	Address        string        `gorm:"type:varchar(120)" json:"address"`
	DataType       TagDataType   `gorm:"type:varchar(20);not null" json:"dataType"`
	Unit           string        `gorm:"type:varchar(30)" json:"unit"`
	Description    string        `gorm:"type:text" json:"description"`
	ReadOnly       bool          `gorm:"not null;default:true" json:"readOnly"`
	ScanIntervalMS int           `gorm:"not null;default:1000" json:"scanIntervalMs"`
	MinValue       *float64      `gorm:"type:numeric(16,4)" json:"minValue"`
	MaxValue       *float64      `gorm:"type:numeric(16,4)" json:"maxValue"`
	Enabled        bool          `gorm:"not null;default:true" json:"enabled"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
