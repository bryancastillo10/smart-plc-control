package simulations

import (
	"smart-plc-control-server/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

type SimulationFilters struct {
	PlantID *uuid.UUID
	Status  *models.SimulationStatus
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindPlantByID(plantID uuid.UUID) (*models.Plants, error) {
	var plant models.Plants
	if err := r.db.Where("id = ?", plantID).First(&plant).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &plant, nil
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
func (r *Repository) FindSimulations(filters SimulationFilters) ([]models.Simulations, error) {
	var simulations []models.Simulations
	query := r.db.Model(&models.Simulations{})

	if filters.PlantID != nil {
		query = query.Where("plant_id = ?", *filters.PlantID)
	}
	if filters.Status != nil {
		query = query.Where("status = ?", *filters.Status)
	}

	if err := query.Order("created_at DESC, id DESC").Find(&simulations).Error; err != nil {
		return nil, err
	}

	return simulations, nil
}

func (r *Repository) CreateSimulation(simulation *models.Simulations) (*models.Simulations, error) {
	if err := r.db.Create(simulation).Error; err != nil {
		return nil, err
	}

	return simulation, nil
}
