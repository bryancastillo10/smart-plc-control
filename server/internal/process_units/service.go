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

func (s *Service) GetProcessUnitsByPlantID(plantID string) ([]ProcessUnitResponse, error) {
	if plantID == "" {
		return nil, appErr.NewBadRequest("Missing plant ID", nil)
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

	processUnits, err := s.repo.FindProcessUnitsByPlantID(parsedPlantID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to get process units", err)
	}

	res := make([]ProcessUnitResponse, 0, len(processUnits))
	for _, processUnit := range processUnits {
		res = append(res, toProcessUnitResponse(processUnit))
	}

	return res, nil
}

func (s *Service) UpdateProcessUnit(processUnitID string, req UpdateProcessUnitRequest) (*ProcessUnitResponse, error) {
	if processUnitID == "" {
		return nil, appErr.NewBadRequest("Missing process unit ID", nil)
	}

	if req.Name == "" && req.Type == "" && req.Description == "" && req.Status == "" {
		return nil, appErr.NewBadRequest("Missing process unit fields to update", nil)
	}

	if req.Status != "" && req.Status != models.Active && req.Status != models.Inactive && req.Status != models.Maintenance {
		return nil, appErr.NewBadRequest("Invalid process unit status", nil)
	}

	parsedProcessUnitID, err := utils.ParseId(processUnitID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid process unit ID", err)
	}

	processUnit, err := s.repo.FindProcessUnitByID(parsedProcessUnitID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find process unit", err)
	}
	if processUnit == nil {
		return nil, appErr.NewNotFound("Process unit not found", nil)
	}

	utils.PatchIfNotZero(&processUnit.Name, req.Name)
	utils.PatchIfNotZero(&processUnit.Type, req.Type)
	utils.PatchIfNotZero(&processUnit.Description, req.Description)
	utils.PatchIfNotZero(&processUnit.Status, req.Status)

	updatedProcessUnit, err := s.repo.UpdateProcessUnit(processUnit)
	if err != nil {
		return nil, appErr.NewInternal("Failed to update process unit", err)
	}

	res := toProcessUnitResponse(*updatedProcessUnit)
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
