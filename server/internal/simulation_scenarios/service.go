package simulation_scenarios

import (
	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
	"smart-plc-control-server/pkg/utils"
	"time"
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

func (s *Service) GetSimulationScenarioByID(scenarioID string) (*SimulationScenarioResponse, error) {
	scenario, err := s.findSimulationScenario(scenarioID)
	if err != nil {
		return nil, err
	}

	res := toSimulationScenarioResponse(*scenario)
	return &res, nil
}

func (s *Service) UpdateSimulationScenario(scenarioID string, req UpdateSimulationScenarioRequest) (*SimulationScenarioResponse, error) {
	if req.Name == "" && req.Description == "" && req.Config == nil && req.Enabled == nil {
		return nil, appErr.NewBadRequest("Missing simulation scenario fields to update", nil)
	}

	scenario, err := s.findSimulationScenario(scenarioID)
	if err != nil {
		return nil, err
	}

	utils.PatchIfNotZero(&scenario.Name, req.Name)
	utils.PatchIfNotZero(&scenario.Description, req.Description)
	if req.Config != nil {
		scenario.Config = req.Config
	}
	if req.Enabled != nil {
		scenario.Enabled = *req.Enabled
	}

	updatedScenario, err := s.repo.UpdateSimulationScenario(scenario)
	if err != nil {
		return nil, appErr.NewInternal("Failed to update simulation scenario", err)
	}

	res := toSimulationScenarioResponse(*updatedScenario)
	return &res, nil
}

func (s *Service) DeleteSimulationScenario(scenarioID string) error {
	scenario, err := s.findSimulationScenario(scenarioID)
	if err != nil {
		return err
	}

	if err := s.repo.DeleteSimulationScenario(scenario); err != nil {
		return appErr.NewInternal("Failed to delete simulation scenario", err)
	}

	return nil
}

func (s *Service) TriggerSimulationScenario(simulationID, scenarioID string) (*TriggerSimulationScenarioResponse, error) {
	if simulationID == "" {
		return nil, appErr.NewBadRequest("Missing simulation ID", nil)
	}
	if scenarioID == "" {
		return nil, appErr.NewBadRequest("Missing simulation scenario ID", nil)
	}

	parsedSimulationID, err := utils.ParseId(simulationID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid simulation ID", err)
	}
	parsedScenarioID, err := utils.ParseId(scenarioID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid simulation scenario ID", err)
	}

	simulation, err := s.repo.FindSimulationByID(parsedSimulationID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find simulation", err)
	}
	if simulation == nil {
		return nil, appErr.NewNotFound("Simulation not found", nil)
	}
	if simulation.Status != models.SimulationRunning {
		return nil, appErr.NewBadRequest("Simulation must be running to trigger a scenario", nil)
	}

	scenario, err := s.repo.FindSimulationScenarioBySimulationIDAndID(parsedSimulationID, parsedScenarioID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find simulation scenario", err)
	}
	if scenario == nil {
		return nil, appErr.NewNotFound("Simulation scenario not found for simulation", nil)
	}
	if !scenario.Enabled {
		return nil, appErr.NewBadRequest("Simulation scenario is disabled", nil)
	}

	return &TriggerSimulationScenarioResponse{
		Message:      "Simulation scenario triggered successfully",
		SimulationID: simulation.ID.String(),
		ScenarioID:   scenario.ID.String(),
		ScenarioName: scenario.Name,
		Config:       scenario.Config,
		TriggeredAt:  time.Now().UTC(),
	}, nil
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

func (s *Service) findSimulationScenario(scenarioID string) (*models.SimulationScenarios, error) {
	if scenarioID == "" {
		return nil, appErr.NewBadRequest("Missing simulation scenario ID", nil)
	}

	parsedScenarioID, err := utils.ParseId(scenarioID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid simulation scenario ID", err)
	}

	scenario, err := s.repo.FindSimulationScenarioByID(parsedScenarioID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find simulation scenario", err)
	}
	if scenario == nil {
		return nil, appErr.NewNotFound("Simulation scenario not found", nil)
	}

	return scenario, nil
}
