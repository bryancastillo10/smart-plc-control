package simulations

import (
	"smart-plc-control-server/internal/models"
	"time"
)

type ListSimulationsQuery struct {
	PlantID string                  `form:"plantId" binding:"omitempty"`
	Status  models.SimulationStatus `form:"status" binding:"omitempty,oneof=IDLE RUNNING PAUSED STOPPED"`
}

type CreateSimulationRequest struct {
	PlantID          string                  `json:"plantId" binding:"required"`
	Name             string                  `json:"name" binding:"required,min=1,max=120"`
	Status           models.SimulationStatus `json:"status" binding:"omitempty,oneof=IDLE RUNNING PAUSED STOPPED"`
	UpdateIntervalMS *int                    `json:"updateIntervalMs" binding:"omitempty,min=1"`
	NoiseFactor      float64                 `json:"noiseFactor" binding:"omitempty,min=0"`
}

type UpdateSimulationRequest struct {
	PlantID          string   `json:"plantId" binding:"omitempty"`
	Name             string   `json:"name" binding:"omitempty,min=1,max=120"`
	UpdateIntervalMS *int     `json:"updateIntervalMs" binding:"omitempty,min=1"`
	NoiseFactor      *float64 `json:"noiseFactor" binding:"omitempty,min=0"`
}

type DeleteSimulationRequest struct {
	Action string `json:"action" binding:"required"`
}

type SimulationResponse struct {
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
