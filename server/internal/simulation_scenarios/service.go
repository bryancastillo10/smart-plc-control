package simulation_scenarios

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

func (s *Service) GetSimulationScenarios() ([]SimulationScenarioResponse, error) {
	scenarios, err := s.repo.FindSimulationScenarios()
	if err != nil {
		return nil, appErr.NewInternal("Failed to get simulation scenarios", err)
	}

	res := make([]SimulationScenarioResponse, 0, len(scenarios))
	for _, scenario := range scenarios {
		res = append(res, toSimulationScenarioResponse(scenario))
	}

	return res, nil
}

func (s *Service) CreateSimulationScenario(simulationID string, req CreateSimulationScenarioRequest) (*SimulationScenarioResponse, error) {
	if simulationID == "" {
		return nil, appErr.NewBadRequest("Missing simulation ID", nil)
	}
	if req.Name == "" || req.Config == nil {
		return nil, appErr.NewBadRequest("Missing required fields", nil)
	}

	parsedSimulationID, err := utils.ParseId(simulationID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid simulation ID", err)
	}

	simulation, err := s.repo.FindSimulationByID(parsedSimulationID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find simulation", err)
	}
	if simulation == nil {
		return nil, appErr.NewNotFound("Simulation not found", nil)
	}

	enabled := true
	if req.Enabled != nil {
		enabled = *req.Enabled
	}

	scenario := &models.SimulationScenarios{
		ID:           utils.GenerateUUID(),
		SimulationID: parsedSimulationID,
		Name:         req.Name,
		Description:  req.Description,
		Config:       req.Config,
		Enabled:      enabled,
	}

	createdScenario, err := s.repo.CreateSimulationScenario(scenario)
	if err != nil {
		return nil, appErr.NewInternal("Failed to create simulation scenario", err)
	}

	res := toSimulationScenarioResponse(*createdScenario)
	return &res, nil
}

func toSimulationScenarioResponse(scenario models.SimulationScenarios) SimulationScenarioResponse {
	return SimulationScenarioResponse{
		ID:           scenario.ID.String(),
		SimulationID: scenario.SimulationID.String(),
		Name:         scenario.Name,
		Description:  scenario.Description,
		Config:       scenario.Config,
		Enabled:      scenario.Enabled,
		CreatedAt:    scenario.CreatedAt,
		UpdatedAt:    scenario.UpdatedAt,
	}
}
