package simulation_scenarios

import (
	"smart-plc-control-server/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindSimulationByID(simulationID uuid.UUID) (*models.Simulations, error) {
	var simulation models.Simulations
	if err := r.db.Where("id = ?", simulationID).First(&simulation).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &simulation, nil
}

func (r *Repository) CreateSimulationScenario(scenario *models.SimulationScenarios) (*models.SimulationScenarios, error) {
	if err := r.db.Create(scenario).Error; err != nil {
		return nil, err
	}

	return scenario, nil
}
