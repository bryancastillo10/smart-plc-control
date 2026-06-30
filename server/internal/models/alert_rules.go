package models

import (
	"time"

	"github.com/google/uuid"
)

type AlertRules struct {
	ID               uuid.UUID     `gorm:"primaryKey;type:uuid" json:"id"`
	TagID            uuid.UUID     `gorm:"type:uuid;not null;index" json:"tagId"`
	Tag              *Tags         `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	Name             string        `gorm:"type:varchar(120);not null" json:"name"`
	Operator         AlertOperator `gorm:"type:varchar(10);not null" json:"operator"`
	ThresholdNumeric *float64      `gorm:"type:numeric(16,4)" json:"thresholdNumeric"`
	ThresholdText    string        `gorm:"type:text" json:"thresholdText"`
	ThresholdBool    *bool         `json:"thresholdBool"`
	Severity         AlertSeverity `gorm:"type:varchar(20);not null" json:"severity"`
	DelaySeconds     int           `gorm:"not null;default:0" json:"delaySeconds"`
	Message          string        `gorm:"type:text" json:"message"`
	Enabled          bool          `gorm:"not null;default:true" json:"enabled"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
