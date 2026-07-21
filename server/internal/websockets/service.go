package websockets

import (
	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
	"smart-plc-control-server/pkg/utils"

	"gorm.io/gorm"
)

const defaultSimulationStreamIntervalMS = 1000

type Service struct {
	db *gorm.DB
}

func NewService(db *gorm.DB) *Service {
	return &Service{db: db}
}

func (s *Service) GetSimulationSnapshots(query SimulationStreamQuery) ([]SimulationSnapshot, error) {
	dbQuery := s.db.Model(&models.Simulations{})

	if query.PlantID != "" {
		parsedPlantID, err := utils.ParseId(query.PlantID)
		if err != nil {
			return nil, appErr.NewBadRequest("Invalid plant ID", err)
		}

		var plant models.Plants
		if err := s.db.Where("id = ?", parsedPlantID).First(&plant).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				return nil, appErr.NewNotFound("Plant not found", nil)
			}
			return nil, appErr.NewInternal("Failed to find plant", err)
		}

		dbQuery = dbQuery.Where("plant_id = ?", parsedPlantID)
	}

	if query.Status != "" {
		if !isValidSimulationStatus(query.Status) {
			return nil, appErr.NewBadRequest("Invalid simulation status", nil)
		}
		dbQuery = dbQuery.Where("status = ?", query.Status)
	}

	var simulations []models.Simulations
	if err := dbQuery.Order("updated_at DESC, id DESC").Find(&simulations).Error; err != nil {
		return nil, appErr.NewInternal("Failed to get simulation snapshots", err)
	}

	return toSimulationSnapshots(simulations), nil
}

func (s *Service) ResolveSimulationStreamInterval(query SimulationStreamQuery) int {
	if query.IntervalMS == nil {
		return defaultSimulationStreamIntervalMS
	}

	return *query.IntervalMS
}

func toSimulationSnapshots(simulations []models.Simulations) []SimulationSnapshot {
	res := make([]SimulationSnapshot, 0, len(simulations))
	for _, simulation := range simulations {
		res = append(res, toSimulationSnapshot(simulation))
	}

	return res
}

func toSimulationSnapshot(simulation models.Simulations) SimulationSnapshot {
	return SimulationSnapshot{
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
