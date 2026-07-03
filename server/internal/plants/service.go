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

func (s *Service) GetAllPlants() ([]PlantResponse, error) {
	plants, err := s.repo.FindAllPlants()
	if err != nil {
		return nil, appErr.NewInternal("Failed to get plants", err)
	}

	res := make([]PlantResponse, 0, len(plants))
	for _, plant := range plants {
		res = append(res, toPlantResponse(plant))
	}

	return res, nil
}

func (s *Service) GetPlantByID(plantID string) (*PlantResponse, error) {
	if plantID == "" {
		return nil, appErr.NewBadRequest("Missing plant ID", nil)
	}

	plant, err := s.repo.FindPlantByID(plantID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to get plant", err)
	}
	if plant == nil {
		return nil, appErr.NewNotFound("Plant not found", nil)
	}

	res := toPlantResponse(*plant)
	return &res, nil
}

func (s *Service) CreatePlant(userID string, req CreatePlantRequest) (*PlantResponse, error) {
	if userID == "" {
		return nil, appErr.NewUnauthorized("Missing authenticated user", nil)
	}

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
		ID:           utils.GenerateUUID(),
		Name:         req.Name,
		Location:     req.Location,
		Description:  req.Description,
		Status:       req.Status,
		AccessibleBy: []string{userID},
	}

	createdPlant, err := s.repo.CreatePlant(plant)
	if err != nil {
		return nil, appErr.NewInternal("Failed to create plant", err)
	}

	res := toPlantResponse(*createdPlant)
	return &res, nil
}

func (s *Service) UpdatePlant(plantID string, req UpdatePlantRequest) (*PlantResponse, error) {
	if plantID == "" {
		return nil, appErr.NewBadRequest("Missing plant ID", nil)
	}

	if req.Name == "" && req.Location == "" && req.Description == "" && req.Status == "" && len(req.AccessibleBy) == 0 {
		return nil, appErr.NewBadRequest("Missing plant details to update", nil)
	}

	if req.Status != "" && req.Status != models.Active && req.Status != models.Inactive && req.Status != models.Maintenance {
		return nil, appErr.NewBadRequest("Invalid plant status", nil)
	}

	plant, err := s.repo.FindPlantByID(plantID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find plant", err)
	}
	if plant == nil {
		return nil, appErr.NewNotFound("Plant not found", nil)
	}

	utils.PatchIfNotZero(&plant.Name, req.Name)
	utils.PatchIfNotZero(&plant.Location, req.Location)
	utils.PatchIfNotZero(&plant.Description, req.Description)
	utils.PatchIfNotZero(&plant.Status, req.Status)
	if len(req.AccessibleBy) > 0 {
		plant.AccessibleBy = req.AccessibleBy
	}

	updatedPlant, err := s.repo.UpdatePlant(plant)
	if err != nil {
		return nil, appErr.NewInternal("Failed to update plant", err)
	}

	res := toPlantResponse(*updatedPlant)
	return &res, nil
}

func (s *Service) DeletePlant(plantID string, req DeletePlantRequest) error {
	if plantID == "" {
		return appErr.NewBadRequest("Missing plant ID", nil)
	}

	if req.Action != "delete" {
		return appErr.NewBadRequest("Delete confirmation must be exactly 'delete'", nil)
	}

	plant, err := s.repo.FindPlantByID(plantID)
	if err != nil {
		return appErr.NewInternal("Failed to find plant", err)
	}
	if plant == nil {
		return appErr.NewNotFound("Plant not found", nil)
	}

	if err := s.repo.DeletePlant(plant); err != nil {
		return appErr.NewInternal("Failed to delete plant", err)
	}

	return nil
}

func toPlantResponse(plant models.Plants) PlantResponse {
	return PlantResponse{
		ID:           plant.ID.String(),
		Name:         plant.Name,
		Location:     plant.Location,
		Description:  plant.Description,
		Status:       plant.Status,
		AccessibleBy: plant.AccessibleBy,
		CreatedAt:    plant.CreatedAt,
		UpdatedAt:    plant.UpdatedAt,
	}
}
