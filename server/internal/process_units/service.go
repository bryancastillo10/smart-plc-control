package process_units

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

func (s *Service) CreateProcessUnit(plantID string, req CreateProcessUnitRequest) (*ProcessUnitResponse, error) {
	if plantID == "" {
		return nil, appErr.NewBadRequest("Missing plant ID", nil)
	}

	if req.Name == "" || req.Type == "" {
		return nil, appErr.NewBadRequest("Missing required fields", nil)
	}

	parsedPlantID, err := utils.ParseId(plantID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid plant ID", err)
	}

	plant, err := s.repo.FindPlantByID(parsedPlantID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find plant", err)
	}
	if plant == nil {
		return nil, appErr.NewNotFound("Plant not found", nil)
	}

	if req.Status == "" {
		req.Status = models.Active
	}

	if req.Status != models.Active && req.Status != models.Inactive && req.Status != models.Maintenance {
		return nil, appErr.NewBadRequest("Invalid process unit status", nil)
	}

	processUnit := &models.ProcessUnits{
		ID:          utils.GenerateUUID(),
		PlantID:     parsedPlantID,
		Name:        req.Name,
		Type:        req.Type,
		Description: req.Description,
		Status:      req.Status,
	}

	createdProcessUnit, err := s.repo.CreateProcessUnit(processUnit)
	if err != nil {
		return nil, appErr.NewInternal("Failed to create process unit", err)
	}

	res := toProcessUnitResponse(*createdProcessUnit)
	return &res, nil
}

func toProcessUnitResponse(processUnit models.ProcessUnits) ProcessUnitResponse {
	return ProcessUnitResponse{
		ID:          processUnit.ID.String(),
		PlantID:     processUnit.PlantID.String(),
		Name:        processUnit.Name,
		Type:        processUnit.Type,
		Description: processUnit.Description,
		Status:      processUnit.Status,
		CreatedAt:   processUnit.CreatedAt,
		UpdatedAt:   processUnit.UpdatedAt,
	}
}
