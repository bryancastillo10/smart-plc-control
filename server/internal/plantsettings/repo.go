package plantsettings

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

func (r *Repository) FindPlantSettingsByPlantID(
	plantID uuid.UUID,
) (*models.PlantSettings, error) {

	var settings models.PlantSettings

	if err := r.db.
		Where("plant_id = ?", plantID).
		First(&settings).Error; err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &settings, nil
}

func (r *Repository) UpdatePlantSettings(
	settings *models.PlantSettings,
) error {
	return r.db.Save(settings).Error
}
