package models

import (
	"time"

	"github.com/google/uuid"
)

type ProcessUnitConnections struct {
	ID           uuid.UUID     `gorm:"primaryKey;type:uuid" json:"id"`
	PlantID      uuid.UUID     `gorm:"type:uuid;not null;index" json:"plantId"`
	Plant        *Plants       `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	SourceUnitID uuid.UUID     `gorm:"type:uuid;not null;index" json:"sourceUnitId"`
	SourceUnit   *ProcessUnits `gorm:"foreignKey:SourceUnitID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	SourcePortID string        `gorm:"type:varchar(80);not null" json:"sourcePortId"`
	TargetUnitID uuid.UUID     `gorm:"type:uuid;not null;index" json:"targetUnitId"`
	TargetUnit   *ProcessUnits `gorm:"foreignKey:TargetUnitID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"-"`
	TargetPortID string        `gorm:"type:varchar(80);not null" json:"targetPortId"`
	Label        string        `gorm:"type:varchar(120)" json:"label"`
	FlowType     FlowType      `gorm:"type:varchar(80)" json:"flowType"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`
}
