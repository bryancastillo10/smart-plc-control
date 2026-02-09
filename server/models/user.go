package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID       uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey" json:"id"`
	UserName string    `gorm:"type:varchar(100);not null" json:"userName"`
	Email    string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	Password string    `gorm:"not null" json:"-"`
	Role     Role      `gorm:"type:varchar(20);not null;check:role IN ('ADMIN','OPERATOR','VIEWER')" json:"role"`
	Language Language  `gorm:"type:varchar(10);not null;check:language IN ('EN','ZH-TW')" json:"language"`

	CreatedAt time.Time `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt time.Time `gorm:"autoUpdateTime" json:"updatedAt"`

	SensorRecords []SensorRecord `gorm:"foreignKey:RecordedBy" json:"sensorRecords"`
}
