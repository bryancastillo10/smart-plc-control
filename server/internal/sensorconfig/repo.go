package sensorconfig

import (
	"errors"
	"plc-dashboard/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) ListByPlantID(plantID uuid.UUID) ([]models.SensorConfig, error) {
	var configs []models.SensorConfig
	if err := r.db.Where("plant_id = ?", plantID).Find(&configs).Error; err != nil {
		return nil, err
	}

	return configs, nil
}

func (r *Repository) GetByID(plantID, configID uuid.UUID) (*models.SensorConfig, error) {
	var config models.SensorConfig
	if err := r.db.
		Where("plant_id = ? AND id = ?", plantID, configID).
		First(&config).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &config, nil
}

func (r *Repository) Create(config *models.SensorConfig) error {
	return r.db.Create(config).Error
}

func (r *Repository) Update(config *models.SensorConfig) error {
	return r.db.Save(config).Error
}

func (r *Repository) Delete(plantID, configID uuid.UUID) error {
	result := r.db.Where("plant_id = ? AND id = ?", plantID, configID).
		Delete(&models.SensorConfig{})
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}
