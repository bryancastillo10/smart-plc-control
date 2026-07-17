package simulations

import (
	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
	"smart-plc-control-server/pkg/utils"
)

const defaultUpdateIntervalMS = 1000

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetSimulations(query ListSimulationsQuery) ([]SimulationResponse, error) {
	filters := SimulationFilters{}

	if query.PlantID != "" {
		parsedPlantID, err := utils.ParseId(query.PlantID)
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

		filters.PlantID = &parsedPlantID
	}

	if query.Status != "" {
		if !isValidSimulationStatus(query.Status) {
			return nil, appErr.NewBadRequest("Invalid simulation status", nil)
		}
		filters.Status = &query.Status
	}

	simulations, err := s.repo.FindSimulations(filters)
	if err != nil {
		return nil, appErr.NewInternal("Failed to get simulations", err)
	}

	return toSimulationResponses(simulations), nil
}

func (s *Service) GetSimulationByID(simulationID string) (*SimulationResponse, error) {
	if simulationID == "" {
		return nil, appErr.NewBadRequest("Missing simulation ID", nil)
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

	res := toSimulationResponse(*simulation)
	return &res, nil
}

func (s *Service) CreateSimulation(req CreateSimulationRequest) (*SimulationResponse, error) {
	if req.PlantID == "" || req.Name == "" {
		return nil, appErr.NewBadRequest("Missing required fields", nil)
	}

	parsedPlantID, err := utils.ParseId(req.PlantID)
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

	status := req.Status
	if status == "" {
		status = models.SimulationIdle
	}
	if !isValidSimulationStatus(status) {
		return nil, appErr.NewBadRequest("Invalid simulation status", nil)
	}
	if status != models.SimulationIdle {
		return nil, appErr.NewBadRequest("Simulation must be created in IDLE status", nil)
	}

	updateIntervalMS := defaultUpdateIntervalMS
	if req.UpdateIntervalMS != nil {
		updateIntervalMS = *req.UpdateIntervalMS
	}
	if updateIntervalMS < 1 {
		return nil, appErr.NewBadRequest("Invalid update interval", nil)
	}
	if req.NoiseFactor < 0 {
		return nil, appErr.NewBadRequest("Invalid noise factor", nil)
	}

	simulation := &models.Simulations{
		ID:               utils.GenerateUUID(),
		PlantID:          parsedPlantID,
		Name:             req.Name,
		Status:           status,
		UpdateIntervalMS: updateIntervalMS,
		NoiseFactor:      req.NoiseFactor,
	}

	createdSimulation, err := s.repo.CreateSimulation(simulation)
	if err != nil {
		return nil, appErr.NewInternal("Failed to create simulation", err)
	}

	res := toSimulationResponse(*createdSimulation)
	return &res, nil
}

func (s *Service) UpdateSimulation(simulationID string, req UpdateSimulationRequest) (*SimulationResponse, error) {
	if simulationID == "" {
		return nil, appErr.NewBadRequest("Missing simulation ID", nil)
	}

	if req.PlantID == "" && req.Name == "" && req.UpdateIntervalMS == nil && req.NoiseFactor == nil {
		return nil, appErr.NewBadRequest("Missing simulation fields to update", nil)
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

	if req.PlantID != "" {
		parsedPlantID, err := utils.ParseId(req.PlantID)
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

		simulation.PlantID = parsedPlantID
	}

	utils.PatchIfNotZero(&simulation.Name, req.Name)

	if req.UpdateIntervalMS != nil {
		if *req.UpdateIntervalMS < 1 {
			return nil, appErr.NewBadRequest("Invalid update interval", nil)
		}
		simulation.UpdateIntervalMS = *req.UpdateIntervalMS
	}

	if req.NoiseFactor != nil {
		if *req.NoiseFactor < 0 {
			return nil, appErr.NewBadRequest("Invalid noise factor", nil)
		}
		simulation.NoiseFactor = *req.NoiseFactor
	}

	updatedSimulation, err := s.repo.UpdateSimulation(simulation)
	if err != nil {
		return nil, appErr.NewInternal("Failed to update simulation", err)
	}

	res := toSimulationResponse(*updatedSimulation)
	return &res, nil
}

func (s *Service) DeleteSimulation(simulationID string, req DeleteSimulationRequest) error {
	if req.Action != "delete" {
		return appErr.NewBadRequest("Delete confirmation must be exactly 'delete'", nil)
	}

	if simulationID == "" {
		return appErr.NewBadRequest("Missing simulation ID", nil)
	}

	parsedSimulationID, err := utils.ParseId(simulationID)
	if err != nil {
		return appErr.NewBadRequest("Invalid simulation ID", err)
	}

	simulation, err := s.repo.FindSimulationByID(parsedSimulationID)
	if err != nil {
		return appErr.NewInternal("Failed to find simulation", err)
	}
	if simulation == nil {
		return appErr.NewNotFound("Simulation not found", nil)
	}

	if simulation.Status == models.SimulationRunning || simulation.Status == models.SimulationPaused {
		return appErr.NewBadRequest("Simulation must be stopped before deletion", nil)
	}

	if err := s.repo.DeleteSimulation(simulation); err != nil {
		return appErr.NewInternal("Failed to delete simulation", err)
	}

	return nil
}

func toSimulationResponses(simulations []models.Simulations) []SimulationResponse {
	res := make([]SimulationResponse, 0, len(simulations))
	for _, simulation := range simulations {
		res = append(res, toSimulationResponse(simulation))
	}

	return res
}

func toSimulationResponse(simulation models.Simulations) SimulationResponse {
	return SimulationResponse{
		ID:               simulation.ID.String(),
		PlantID:          simulation.PlantID.String(),
		Name:             simulation.Name,
		Status:           simulation.Status,
		UpdateIntervalMS: simulation.UpdateIntervalMS,
		NoiseFactor:      simulation.NoiseFactor,
		StartedAt:        simulation.StartedAt,
		PausedAt:         simulation.PausedAt,
		StoppedAt:        simulation.StoppedAt,
		CreatedAt:        simulation.CreatedAt,
		UpdatedAt:        simulation.UpdatedAt,
	}
}

func isValidSimulationStatus(status models.SimulationStatus) bool {
	return status == models.SimulationIdle ||
		status == models.SimulationRunning ||
		status == models.SimulationPaused ||
		status == models.SimulationStopped
}
