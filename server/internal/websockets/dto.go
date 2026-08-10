package websockets

import (
	"smart-plc-control-server/internal/models"
	"time"
)

const SimulationSnapshotEvent = "simulation.snapshot"

// SimulationTelemetrySnapshotEvent delivers the latest persisted telemetry for
// the simulations selected by the websocket query.
const SimulationTelemetrySnapshotEvent = "simulation.telemetry.snapshot"

type SimulationStreamQuery struct {
	PlantID    string                  `form:"plantId" binding:"required,uuid"`
	Status     models.SimulationStatus `form:"status" binding:"omitempty,oneof=IDLE RUNNING PAUSED STOPPED"`
	IntervalMS *int                    `form:"intervalMs" binding:"omitempty,min=250,max=10000"`
}

type Message struct {
	Type   string      `json:"type"`
	Data   interface{} `json:"data,omitempty"`
	Error  string      `json:"error,omitempty"`
	SentAt time.Time   `json:"sentAt"`
}

type SimulationSnapshot struct {
	ID               string                  `json:"id"`
	PlantID          string                  `json:"plantId"`
	Name             string                  `json:"name"`
	Status           models.SimulationStatus `json:"status"`
	UpdateIntervalMS int                     `json:"updateIntervalMs"`
	NoiseFactor      float64                 `json:"noiseFactor"`
	StartedAt        *time.Time              `json:"startedAt"`
	PausedAt         *time.Time              `json:"pausedAt"`
	StoppedAt        *time.Time              `json:"stoppedAt"`
	CreatedAt        time.Time               `json:"createdAt"`
	UpdatedAt        time.Time               `json:"updatedAt"`
}

// SimulationTelemetrySnapshot is a point-in-time view of the operational data
// associated with the selected simulation plants. It is emitted separately
// from SimulationSnapshot to preserve the existing websocket contract.
type SimulationTelemetrySnapshot struct {
	PlantID  string                        `json:"plantId,omitempty"`
	Devices  []DeviceTelemetrySnapshot     `json:"devices"`
	Readings []TagReadingTelemetrySnapshot `json:"readings"`
	Alerts   []AlertTelemetrySnapshot      `json:"alerts"`
}

type DeviceTelemetrySnapshot struct {
	ID               string                  `json:"id"`
	PlantID          string                  `json:"plantId"`
	Name             string                  `json:"name"`
	ConnectionStatus models.ConnectionStatus `json:"connectionStatus"`
	Enabled          bool                    `json:"enabled"`
	LastConnectedAt  *time.Time              `json:"lastConnectedAt,omitempty"`
	UpdatedAt        time.Time               `json:"updatedAt"`
}

type TagReadingTelemetrySnapshot struct {
	ID            uint64                `json:"id"`
	PlantID       string                `json:"plantId"`
	TagID         string                `json:"tagId"`
	DeviceID      string                `json:"deviceId"`
	ProcessUnitID *string               `json:"processUnitId,omitempty"`
	TagName       string                `json:"tagName"`
	Unit          string                `json:"unit"`
	ValueNumeric  *float64              `json:"valueNumeric,omitempty"`
	ValueText     string                `json:"valueText,omitempty"`
	ValueBool     *bool                 `json:"valueBool,omitempty"`
	Quality       models.ReadingQuality `json:"quality"`
	Source        models.ReadingSource  `json:"source"`
	RecordedAt    time.Time             `json:"recordedAt"`
}

type AlertTelemetrySnapshot struct {
	ID             string               `json:"id"`
	PlantID        string               `json:"plantId"`
	AlertRuleID    string               `json:"alertRuleId"`
	AlertRuleName  string               `json:"alertRuleName"`
	TagID          string               `json:"tagId"`
	TagName        string               `json:"tagName"`
	ProcessUnitID  *string              `json:"processUnitId,omitempty"`
	Severity       models.AlertSeverity `json:"severity"`
	TriggerValue   string               `json:"triggerValue"`
	Status         models.AlertStatus   `json:"status"`
	Message        string               `json:"message"`
	TriggeredAt    time.Time            `json:"triggeredAt"`
	AcknowledgedAt *time.Time           `json:"acknowledgedAt,omitempty"`
	ResolvedAt     *time.Time           `json:"resolvedAt,omitempty"`
}
