package plant

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

func (r *Repository) CreatePlantWithRelations(
	plant *models.Plant,
	settings *models.PlantSettings,
	valves []models.Valve,
) error {

	return r.db.Transaction(func(tx *gorm.DB) error {

		if err := tx.Create(plant).Error; err != nil {
			return err
		}

		if err := tx.Create(settings).Error; err != nil {
			return err
		}

		if len(valves) > 0 {
			if err := tx.Create(&valves).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (r *Repository) FindUserByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	if err := r.db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, nil
	}

	return &user, nil
}
