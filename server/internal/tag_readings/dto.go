package tag_readings

import (
	"smart-plc-control-server/internal/models"
	"time"
)

type LatestReadingsQuery struct {
	DeviceID      string `form:"deviceId" binding:"omitempty"`
	ProcessUnitID string `form:"processUnitId" binding:"omitempty"`
	TagIDs        string `form:"tagIds" binding:"omitempty"`
}

type HistoryReadingsQuery struct {
	TagIDs   string `form:"tagIds" binding:"required"`
	From     string `form:"from" binding:"required"`
	To       string `form:"to" binding:"required"`
	Interval string `form:"interval" binding:"omitempty"`
}

type ReadingResponse struct {
	ID           uint64                `json:"id"`
	TagID        string                `json:"tagId"`
	ValueNumeric *float64              `json:"valueNumeric"`
	ValueText    string                `json:"valueText"`
	ValueBool    *bool                 `json:"valueBool"`
	Quality      models.ReadingQuality `json:"quality"`
	Source       models.ReadingSource  `json:"source"`
	RecordedAt   time.Time             `json:"recordedAt"`
}
