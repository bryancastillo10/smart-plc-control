package simulation_engine

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

func (r *Repository) FindRunningSimulations() ([]models.Simulations, error) {
	var simulations []models.Simulations
	err := r.db.
		Where("status = ?", models.SimulationRunning).
		Order("updated_at DESC, id DESC").
		Find(&simulations).Error
	return simulations, err
}

func (r *Repository) FindSimulatedTags(plantID uuid.UUID) ([]models.Tags, error) {
	var tags []models.Tags
	err := r.db.Model(&models.Tags{}).
		Joins("JOIN devices ON devices.id = tags.device_id").
		Where("devices.plant_id = ?", plantID).
		Where("devices.enabled = ?", true).
		Where("devices.protocol = ?", models.Simulator).
		Where("tags.enabled = ?", true).
		Order("tags.id ASC").
		Find(&tags).Error
	return tags, err
}

func (r *Repository) FindLatestReading(tagID uuid.UUID) (*models.TagReadings, error) {
	var reading models.TagReadings
	err := r.db.
		Where("tag_id = ?", tagID).
		Order("recorded_at DESC, id DESC").
		First(&reading).Error
	if err == gorm.ErrRecordNotFound {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &reading, nil
}

func (r *Repository) CreateReadings(readings []models.TagReadings) error {
	if len(readings) == 0 {
		return nil
	}
	return r.db.Create(&readings).Error
}
