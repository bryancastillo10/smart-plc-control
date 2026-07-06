package tag_readings

import (
	"smart-plc-control-server/internal/models"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

type LatestReadingFilters struct {
	DeviceID      *uuid.UUID
	ProcessUnitID *uuid.UUID
	TagIDs        []uuid.UUID
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

func (r *Repository) FindTagsByIDs(tagIDs []uuid.UUID) ([]models.Tags, error) {
	var tags []models.Tags
	if len(tagIDs) == 0 {
		return tags, nil
	}

	if err := r.db.Where("id IN ?", tagIDs).Find(&tags).Error; err != nil {
		return nil, err
	}

	return tags, nil
}

func (r *Repository) FindLatestReadings(filters LatestReadingFilters) ([]models.TagReadings, error) {
	var readings []models.TagReadings

	query := r.db.Table("tag_readings").
		Select("DISTINCT ON (tag_readings.tag_id) tag_readings.*").
		Joins("JOIN tags ON tags.id = tag_readings.tag_id")

	if filters.DeviceID != nil {
		query = query.Where("tags.device_id = ?", *filters.DeviceID)
	}
	if filters.ProcessUnitID != nil {
		query = query.Where("tags.process_unit_id = ?", *filters.ProcessUnitID)
	}
	if len(filters.TagIDs) > 0 {
		query = query.Where("tag_readings.tag_id IN ?", filters.TagIDs)
	}

	if err := query.
		Order(strings.Join([]string{
			"tag_readings.tag_id",
			"tag_readings.recorded_at DESC",
			"tag_readings.id DESC",
		}, ", ")).
		Find(&readings).Error; err != nil {
		return nil, err
	}

	return readings, nil
}
