package tags

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

func (r *Repository) FindProcessUnitByID(processUnitID uuid.UUID) (*models.ProcessUnits, error) {
	var processUnit models.ProcessUnits
	if err := r.db.Where("id = ?", processUnitID).First(&processUnit).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &processUnit, nil
}

func (r *Repository) FindTagByDeviceIDAndName(deviceID uuid.UUID, name string) (*models.Tags, error) {
	var tag models.Tags
	if err := r.db.Where("device_id = ? AND name = ?", deviceID, name).First(&tag).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &tag, nil
}

func (r *Repository) CreateTag(tag *models.Tags) (*models.Tags, error) {
	if err := r.db.Create(tag).Error; err != nil {
		return nil, err
	}

	return tag, nil
}
