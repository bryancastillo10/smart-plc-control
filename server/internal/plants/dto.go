package plants

import (
	"smart-plc-control-server/internal/models"
	"time"
)

type CreatePlantRequest struct {
	Name        string             `json:"name" binding:"required,min=1,max=120"`
	Location    string             `json:"location" binding:"required,min=1,max=200"`
	Description string             `json:"description" binding:"omitempty"`
	Status      models.PlantStatus `json:"status" binding:"omitempty,oneof=ACTIVE INACTIVE MAINTENANCE"`
}

type UpdatePlantRequest struct {
	Name        string             `json:"name" binding:"omitempty,min=1,max=120"`
	Location    string             `json:"location" binding:"omitempty,min=1,max=200"`
	Description string             `json:"description" binding:"omitempty"`
	Status      models.PlantStatus `json:"status" binding:"omitempty,oneof=ACTIVE INACTIVE MAINTENANCE"`
}

type PlantResponse struct {
	ID          string             `json:"id"`
	Name        string             `json:"name"`
	Location    string             `json:"location"`
	Description string             `json:"description"`
	Status      models.PlantStatus `json:"status"`
	CreatedAt   time.Time          `json:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt"`
}
