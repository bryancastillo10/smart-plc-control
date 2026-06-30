package models

import (
	"time"

	"github.com/google/uuid"
)

type Alerts struct {
	ID                 uuid.UUID   `gorm:"primaryKey;type:uuid" json:"id"`
	AlertRuleID        uuid.UUID   `gorm:"type:uuid;not null;index" json:"alertRuleId"`
	AlertRule          *AlertRules `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	TriggerValue       string      `gorm:"type:text" json:"triggerValue"`
	Status             AlertStatus `gorm:"type:varchar(20);not null" json:"status"`
	Message            string      `gorm:"type:text;not null" json:"message"`
	TriggeredAt        time.Time   `gorm:"type:timestamptz;not null;index" json:"triggeredAt"`
	AcknowledgedAt     *time.Time  `gorm:"type:timestamptz" json:"acknowledgedAt"`
	AcknowledgedBy     *uuid.UUID  `gorm:"type:uuid;index" json:"acknowledgedBy"`
	AcknowledgedByUser *Users      `gorm:"foreignKey:AcknowledgedBy;references:ID;constraint:OnUpdate:CASCADE,OnDelete:SET NULL;" json:"-"`
	ResolvedAt         *time.Time  `gorm:"type:timestamptz" json:"resolvedAt"`
}
