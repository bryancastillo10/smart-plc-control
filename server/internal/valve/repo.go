package valve

import (
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
		return nil, err
	}

	return &valve, nil
}

func (r *Repository) UpdateValveSettings(valve *models.Valve) error {
	return r.db.Save(valve).Error
}
