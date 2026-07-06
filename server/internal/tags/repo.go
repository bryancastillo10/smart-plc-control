package tags

import (
	"smart-plc-control-server/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

type TagFilters struct {
	PlantID       *uuid.UUID
	DeviceID      *uuid.UUID
	ProcessUnitID *uuid.UUID
	Enabled       *bool
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

func (r *Repository) FindTagByID(tagID uuid.UUID) (*models.Tags, error) {
	var tag models.Tags
	if err := r.db.Where("id = ?", tagID).First(&tag).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &tag, nil
}

func (r *Repository) FindLatestReadingByTagID(tagID uuid.UUID) (*models.TagReadings, error) {
	var reading models.TagReadings
	if err := r.db.Where("tag_id = ?", tagID).Order("recorded_at DESC").First(&reading).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &reading, nil
}

func (r *Repository) CreateTag(tag *models.Tags) (*models.Tags, error) {
	if err := r.db.Create(tag).Error; err != nil {
		return nil, err
	}

	return tag, nil
}

func (r *Repository) UpdateTag(tag *models.Tags) (*models.Tags, error) {
	if err := r.db.Save(tag).Error; err != nil {
		return nil, err
	}

	return tag, nil
}

func (r *Repository) FindTagsByDeviceID(deviceID uuid.UUID) ([]models.Tags, error) {
	var tags []models.Tags
	if err := r.db.Where("device_id = ?", deviceID).Order("created_at DESC").Find(&tags).Error; err != nil {
		return nil, err
	}

	return tags, nil
}

func (r *Repository) FindTags(filters TagFilters) ([]models.Tags, error) {
	var tags []models.Tags
	query := r.db.Model(&models.Tags{})

	if filters.PlantID != nil {
		query = query.Joins("JOIN devices ON devices.id = tags.device_id").
			Where("devices.plant_id = ?", *filters.PlantID)
	}
	if filters.DeviceID != nil {
		query = query.Where("tags.device_id = ?", *filters.DeviceID)
	}
	if filters.ProcessUnitID != nil {
		query = query.Where("tags.process_unit_id = ?", *filters.ProcessUnitID)
	}
	if filters.Enabled != nil {
		query = query.Where("tags.enabled = ?", *filters.Enabled)
	}

	if err := query.Order("tags.created_at DESC").Find(&tags).Error; err != nil {
		return nil, err
	}

	return tags, nil
}

func (r *Repository) FindTagsByProcessUnitID(processUnitID uuid.UUID) ([]models.Tags, error) {
	var tags []models.Tags
	if err := r.db.Where("process_unit_id = ?", processUnitID).Order("created_at DESC").Find(&tags).Error; err != nil {
		return nil, err
	}

	return tags, nil
}
