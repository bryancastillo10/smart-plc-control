package devices

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

func (r *Repository) FindAllDevices() ([]models.Devices, error) {
	var devices []models.Devices
	if err := r.db.Order("created_at DESC").Find(&devices).Error; err != nil {
		return nil, err
	}

	return devices, nil
}

func (r *Repository) FindDeviceByID(deviceID uuid.UUID) (*models.Devices, error) {
	var device models.Devices
	if err := r.db.Where("id = ?", deviceID).First(&device).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &device, nil
}

func (r *Repository) CreateDevice(device *models.Devices) (*models.Devices, error) {
	if err := r.db.Create(device).Error; err != nil {
		return nil, err
	}

	return device, nil
}

func (r *Repository) UpdateDevice(device *models.Devices) (*models.Devices, error) {
	if err := r.db.Save(device).Error; err != nil {
		return nil, err
	}

	return device, nil
}
