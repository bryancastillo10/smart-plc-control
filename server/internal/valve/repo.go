package valve

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

func (r *Repository) FindValveByID(plantID, valveID uuid.UUID) (*models.Valve, error) {
	var valve models.Valve

	if err := r.db.
		Where("id = ? AND plant_id = ?", valveID, plantID).
		First(&valve).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}

	return &valve, nil
}

func (r *Repository) ListValvesByPlantID(plantID uuid.UUID) ([]models.Valve, error) {
	var valves []models.Valve
	if err := r.db.Where("plant_id = ?", plantID).Find(&valves).Error; err != nil {
		return nil, err
	}

	return valves, nil
}

func (r *Repository) UpdateValveSettings(valve *models.Valve) error {
	return r.db.Save(valve).Error
}
