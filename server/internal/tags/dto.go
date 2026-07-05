package tags

import (
	"smart-plc-control-server/internal/models"
	"time"
)

type CreateTagRequest struct {
	ProcessUnitID  string             `json:"processUnitId" binding:"omitempty"`
	Name           string             `json:"name" binding:"required,min=1,max=120"`
	Address        string             `json:"address" binding:"omitempty,max=120"`
	DataType       models.TagDataType `json:"dataType" binding:"required,oneof=BOOL INT FLOAT STRING"`
	Unit           string             `json:"unit" binding:"omitempty,max=30"`
	Description    string             `json:"description" binding:"omitempty"`
	ReadOnly       *bool              `json:"readOnly" binding:"omitempty"`
	ScanIntervalMS int                `json:"scanIntervalMs" binding:"omitempty,min=1"`
	MinValue       *float64           `json:"minValue" binding:"omitempty"`
	MaxValue       *float64           `json:"maxValue" binding:"omitempty"`
	Enabled        *bool              `json:"enabled" binding:"omitempty"`
}

type ListTagsQuery struct {
	PlantID       string `form:"plantId" binding:"omitempty"`
	DeviceID      string `form:"deviceId" binding:"omitempty"`
	ProcessUnitID string `form:"processUnitId" binding:"omitempty"`
	Enabled       *bool  `form:"enabled" binding:"omitempty"`
}

type TagResponse struct {
	ID             string             `json:"id"`
	DeviceID       string             `json:"deviceId"`
	ProcessUnitID  *string            `json:"processUnitId"`
	Name           string             `json:"name"`
	Address        string             `json:"address"`
	DataType       models.TagDataType `json:"dataType"`
	Unit           string             `json:"unit"`
	Description    string             `json:"description"`
	ReadOnly       bool               `json:"readOnly"`
	ScanIntervalMS int                `json:"scanIntervalMs"`
	MinValue       *float64           `json:"minValue"`
	MaxValue       *float64           `json:"maxValue"`
	Enabled        bool               `json:"enabled"`
	CreatedAt      time.Time          `json:"createdAt"`
	UpdatedAt      time.Time          `json:"updatedAt"`
}

type TagDetailResponse struct {
	TagResponse
	LatestReading *LatestTagReadingResponse `json:"latestReading"`
}

type LatestTagReadingResponse struct {
	ID           uint64                `json:"id"`
	TagID        string                `json:"tagId"`
	ValueNumeric *float64              `json:"valueNumeric"`
	ValueText    string                `json:"valueText"`
	ValueBool    *bool                 `json:"valueBool"`
	Quality      models.ReadingQuality `json:"quality"`
	Source       models.ReadingSource  `json:"source"`
	RecordedAt   time.Time             `json:"recordedAt"`
}
