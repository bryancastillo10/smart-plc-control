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

func (r *Repository) FindAllPlants() ([]models.Plants, error) {
	var plants []models.Plants
	if err := r.db.Order("created_at DESC").Find(&plants).Error; err != nil {
		return nil, err
	}

	return plants, nil
}

func (r *Repository) FindPlantByID(plantID string) (*models.Plants, error) {
	var plant models.Plants
	if err := r.db.Where("id = ?", plantID).First(&plant).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &plant, nil
}

func (r *Repository) UpdatePlant(plant *models.Plants) (*models.Plants, error) {
	if err := r.db.Save(plant).Error; err != nil {
		return nil, err
	}

	return plant, nil
}

func (r *Repository) DeletePlant(plant *models.Plants) error {
	return r.db.Delete(plant).Error
}
