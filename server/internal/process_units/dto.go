package process_units

import (
	"smart-plc-control-server/internal/models"
	"time"
)

type CreateProcessUnitRequest struct {
	Name        string                   `json:"name" binding:"required,min=1,max=120"`
	Type        string                   `json:"type" binding:"required,min=1,max=80"`
	Description string                   `json:"description" binding:"omitempty"`
	Status      models.PlantStatus       `json:"status" binding:"omitempty,oneof=ACTIVE INACTIVE MAINTENANCE"`
	Position    *models.Position         `json:"position" binding:"omitempty"`
	Ports       []models.ProcessUnitPort `json:"ports" binding:"omitempty"`
}

type UpdateProcessUnitRequest struct {
	Name        string                   `json:"name" binding:"omitempty,min=1,max=120"`
	Type        string                   `json:"type" binding:"omitempty,min=1,max=80"`
	Description string                   `json:"description" binding:"omitempty"`
	Status      models.PlantStatus       `json:"status" binding:"omitempty,oneof=ACTIVE INACTIVE MAINTENANCE"`
	Position    *models.Position         `json:"position" binding:"omitempty"`
	Ports       []models.ProcessUnitPort `json:"ports" binding:"omitempty"`
}

type DeleteProcessUnitRequest struct {
	Action string `json:"action" binding:"required"`
}

type ProcessUnitResponse struct {
	ID          string                   `json:"id"`
	PlantID     string                   `json:"plantId"`
	Name        string                   `json:"name"`
	Type        string                   `json:"type"`
	Description string                   `json:"description"`
	Status      models.PlantStatus       `json:"status"`
	Position    models.Position          `json:"position"`
	Ports       []models.ProcessUnitPort `json:"ports"`
	CreatedAt   time.Time                `json:"createdAt"`
	UpdatedAt   time.Time                `json:"updatedAt"`
}

type CreateProcessUnitConnectionRequest struct {
	SourceUnitID string          `json:"sourceUnitId" binding:"required"`
	SourcePortID string          `json:"sourcePortId" binding:"required"`
	TargetUnitID string          `json:"targetUnitId" binding:"required"`
	TargetPortID string          `json:"targetPortId" binding:"required"`
	Label        string          `json:"label" binding:"omitempty,max=120"`
	FlowType     models.FlowType `json:"flowType" binding:"omitempty,oneof=WATER WASTEWATER SLUDGE GAS CHEMICAL RAW_MATERIAL OTHERS"`
}

type UpdateProcessUnitConnectionRequest struct {
	SourceUnitID string          `json:"sourceUnitId" binding:"omitempty"`
	SourcePortID string          `json:"sourcePortId" binding:"omitempty"`
	TargetUnitID string          `json:"targetUnitId" binding:"omitempty"`
	TargetPortID string          `json:"targetPortId" binding:"omitempty"`
	Label        string          `json:"label" binding:"omitempty,max=120"`
	FlowType     models.FlowType `json:"flowType" binding:"omitempty,oneof=WATER WASTEWATER SLUDGE GAS CHEMICAL RAW_MATERIAL OTHERS"`
}

type DeleteProcessUnitConnectionRequest struct {
	Action string `json:"action" binding:"required"`
}

type ProcessUnitConnectionResponse struct {
	ID           string          `json:"id"`
	PlantID      string          `json:"plantId"`
	SourceUnitID string          `json:"sourceUnitId"`
	SourcePortID string          `json:"sourcePortId"`
	TargetUnitID string          `json:"targetUnitId"`
	TargetPortID string          `json:"targetPortId"`
	Label        string          `json:"label"`
	FlowType     models.FlowType `json:"flowType"`
	CreatedAt    time.Time       `json:"createdAt"`
	UpdatedAt    time.Time       `json:"updatedAt"`
}
