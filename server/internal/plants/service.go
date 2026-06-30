package plants

import (
	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
	"smart-plc-control-server/pkg/utils"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreatePlant(req CreatePlantRequest) (*PlantResponse, error) {
	if req.Name == "" || req.Location == "" {
		return nil, appErr.NewBadRequest("Missing required fields", nil)
	}

	if req.Status == "" {
		req.Status = models.Active
	}

	if req.Status != models.Active && req.Status != models.Inactive && req.Status != models.Maintenance {
		return nil, appErr.NewBadRequest("Invalid plant status", nil)
	}

	plant := &models.Plants{
		ID:          utils.GenerateUUID(),
		Name:        req.Name,
		Location:    req.Location,
		Description: req.Description,
		Status:      req.Status,
	}

	createdPlant, err := s.repo.CreatePlant(plant)
	if err != nil {
		return nil, appErr.NewInternal("Failed to create plant", err)
	}

	res := toPlantResponse(*createdPlant)
	return &res, nil
}

func toPlantResponse(plant models.Plants) PlantResponse {
	return PlantResponse{
		ID:          plant.ID.String(),
		Name:        plant.Name,
		Location:    plant.Location,
		Description: plant.Description,
		Status:      plant.Status,
		CreatedAt:   plant.CreatedAt,
		UpdatedAt:   plant.UpdatedAt,
	}
}
