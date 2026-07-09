package simulations

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

func (r *Repository) CreateSimulation(simulation *models.Simulations) (*models.Simulations, error) {
	if err := r.db.Create(simulation).Error; err != nil {
		return nil, err
	}

	return simulation, nil
}
