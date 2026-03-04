package valve

import (
	"plc-dashboard/models"
	appErr "plc-dashboard/pkg/errors"
	"plc-dashboard/pkg/utils"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func mapValveResponse(valve models.Valve) ValveResponse {
	return ValveResponse{
		ID:          valve.ID.String(),
		PlantID:     valve.PlantID.String(),
		Name:        valve.Name,
		Location:    valve.Location,
		Description: valve.Description,
		Position:    valve.Position,
		IsAuto:      valve.IsAuto,
	}
}

func (s *Service) ListValves(plantId string) ([]ValveResponse, error) {
	pid, err := utils.ParseId(plantId)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid plant ID", err)
	}

	valves, err := s.repo.ListValvesByPlantID(pid)
	if err != nil {
		return nil, appErr.NewInternal("Failed to retrieve valves", err)
	}

	response := make([]ValveResponse, 0, len(valves))
	for _, v := range valves {
		response = append(response, mapValveResponse(v))
	}

	return response, nil
}

func (s *Service) GetValveByID(plantId string, valveId string) (*ValveResponse, error) {
	pid, err := utils.ParseId(plantId)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid plant ID", err)
	}

	vid, err := utils.ParseId(valveId)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid valve ID", err)
	}

	valve, err := s.repo.FindValveByID(pid, vid)
	if err != nil {
		return nil, appErr.NewInternal("Failed to retrieve valve", err)
	}
	if valve == nil {
		return nil, appErr.NewNotFound("Valve not found in this plant", nil)
	}

	response := mapValveResponse(*valve)
	return &response, nil
}

func (s *Service) UpdateValveSettings(req UpdateValveRequest, plantId string, valveId string) error {
	pid, err := utils.ParseId(plantId)
	if err != nil {
		return appErr.NewBadRequest("Invalid plant ID", err)
	}

	vid, err := utils.ParseId(valveId)
	if err != nil {
		return appErr.NewBadRequest("Invalid valve ID", err)
	}

	valve, err := s.repo.FindValveByID(pid, vid)
	if err != nil {
		return appErr.NewInternal("Failed to retrieve valve", err)
	}
	if valve == nil {
		return appErr.NewNotFound("Valve not found in this plant", nil)
	}

	if req.Position != nil {
		valve.Position = *req.Position
	}

	if req.IsAuto != nil {
		valve.IsAuto = *req.IsAuto
	}

	if err := s.repo.UpdateValveSettings(valve); err != nil {
		return appErr.NewInternal("Failed to update valve", err)
	}

	return nil
}
