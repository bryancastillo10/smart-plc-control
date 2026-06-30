package models

import (
	"time"

	"github.com/google/uuid"
)

type TagReadings struct {
	ID           uint64         `gorm:"primaryKey;autoIncrement" json:"id"`
	TagID        uuid.UUID      `gorm:"type:uuid;not null;index:idx_tag_readings_tag_recorded_at" json:"tagId"`
	Tag          *Tags          `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	ValueNumeric *float64       `gorm:"type:numeric(16,4)" json:"valueNumeric"`
	ValueText    string         `gorm:"type:text" json:"valueText"`
	ValueBool    *bool          `json:"valueBool"`
	Quality      ReadingQuality `gorm:"type:varchar(20);not null" json:"quality"`
	Source       ReadingSource  `gorm:"type:varchar(20);not null" json:"source"`
	RecordedAt   time.Time      `gorm:"type:timestamptz;not null;index:idx_tag_readings_tag_recorded_at" json:"recordedAt"`
}
