package plants

import (
	"smart-plc-control-server/internal/models"

	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) CreatePlant(plant *models.Plants) (*models.Plants, error) {
	if err := r.db.Create(plant).Error; err != nil {
		return nil, err
	}

	return plant, nil
}
