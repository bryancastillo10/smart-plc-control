package models

import (
	"time"

	"github.com/google/uuid"
)

type AuditLogs struct {
	ID         uint64                 `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID     *uuid.UUID             `gorm:"type:uuid;index" json:"userId"`
	Action     string                 `gorm:"type:varchar(50);not null" json:"action"`
	EntityType string                 `gorm:"type:varchar(50);not null" json:"entityType"`
	EntityID   *uuid.UUID             `gorm:"type:uuid;index" json:"entityId"`
	Details    map[string]interface{} `gorm:"type:jsonb;serializer:json" json:"details"`
	CreatedAt  time.Time              `gorm:"autoCreateTime;type:timestamptz;not null" json:"createdAt"`
}
