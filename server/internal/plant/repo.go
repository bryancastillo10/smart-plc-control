package plant

import (
	"plc-dashboard/internal/sensorconfig"
	"plc-dashboard/models"
	"plc-dashboard/pkg/utils"

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
) (*models.Plant, error) {

	err := r.db.Transaction(func(tx *gorm.DB) error {

		// Create Plant
		if err := tx.Create(plant).Error; err != nil {
			return err
		}

		settings.ID = utils.GenerateUUID()
		settings.PlantID = plant.ID

		// Create Plant Settings
		if err := tx.Create(settings).Error; err != nil {
			return err
		}

		for i := range valves {
			valves[i].PlantID = plant.ID
		}

		// Create Valve
		if err := tx.Create(&valves).Error; err != nil {
			return err
		}

		// Default Sensor Configs
		var sensorConfigs []models.SensorConfig

		// Plant level sensors
		for _, tpl := range sensorconfig.DefaultPlantSensors {
			sensorConfigs = append(sensorConfigs, models.SensorConfig{
				ID:          utils.GenerateUUID(),
				PlantID:     plant.ID,
				ValveID:     nil,
				Sensor:      tpl.Sensor,
				BaseMin:     tpl.BaseMin,
				BaseMax:     tpl.BaseMax,
				EffectScale: tpl.EffectScale,
			})
		}

		// Valve level sensors
		for _, valve := range valves {
			for _, tpl := range sensorconfig.DefaultValveSensors {
				vID := valve.ID
				sensorConfigs = append(sensorConfigs, models.SensorConfig{
					ID:          utils.GenerateUUID(),
					PlantID:     plant.ID,
					ValveID:     &vID,
					Sensor:      tpl.Sensor,
					BaseMin:     tpl.BaseMin,
					BaseMax:     tpl.BaseMax,
					EffectScale: tpl.EffectScale,
				})
			}
		}

		if len(sensorConfigs) > 0 {
			if err := tx.Create(&sensorConfigs).Error; err != nil {
				return err
			}
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	// In-memory handling of saved data
	var result models.Plant
	if err := r.db.
		Preload("Settings").
		Preload("Valves.SensorConfigs").
		Preload("Sensors").
		First(&result, "id = ?", plant.ID).Error; err != nil {
		return nil, err
	}

	return &result, nil
}

func (r *Repository) GetAllPlants() ([]models.Plant, error) {
	var plants []models.Plant

	if err := r.db.
		Preload("Settings.UpdatedByUser").
		Preload("Valves").
		Find(&plants).Error; err != nil {
		return nil, err
	}

	return plants, nil
}

func (r *Repository) FindUserByID(id uuid.UUID) (*models.User, error) {
	var user models.User
	if err := r.db.Where("id = ?", id).First(&user).Error; err != nil {
		return nil, nil
	}

	return &user, nil
}
