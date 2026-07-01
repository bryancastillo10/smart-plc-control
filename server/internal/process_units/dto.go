package process_units

import (
	"smart-plc-control-server/internal/models"
	"time"
)

type CreateProcessUnitRequest struct {
	Name        string             `json:"name" binding:"required,min=1,max=120"`
	Type        string             `json:"type" binding:"required,min=1,max=80"`
	Description string             `json:"description" binding:"omitempty"`
	Status      models.PlantStatus `json:"status" binding:"omitempty,oneof=ACTIVE INACTIVE MAINTENANCE"`
}

type ProcessUnitResponse struct {
	ID          string             `json:"id"`
	PlantID     string             `json:"plantId"`
	Name        string             `json:"name"`
	Type        string             `json:"type"`
	Description string             `json:"description"`
	Status      models.PlantStatus `json:"status"`
	CreatedAt   time.Time          `json:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt"`
}
