package websockets

import (
	"smart-plc-control-server/internal/models"
	"time"
)

const SimulationSnapshotEvent = "simulation.snapshot"

type SimulationStreamQuery struct {
	PlantID    string                  `form:"plantId" binding:"omitempty"`
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
