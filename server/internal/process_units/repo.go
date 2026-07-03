package process_units

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

func (r *Repository) CreateProcessUnit(processUnit *models.ProcessUnits) (*models.ProcessUnits, error) {
	if err := r.db.Create(processUnit).Error; err != nil {
		return nil, err
	}

	return processUnit, nil
}

func (r *Repository) FindProcessUnitsByPlantID(plantID uuid.UUID) ([]models.ProcessUnits, error) {
	var processUnits []models.ProcessUnits
	if err := r.db.Where("plant_id = ?", plantID).Order("created_at DESC").Find(&processUnits).Error; err != nil {
		return nil, err
	}

	return processUnits, nil
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

func (r *Repository) UpdateProcessUnit(processUnit *models.ProcessUnits) (*models.ProcessUnits, error) {
	if err := r.db.Save(processUnit).Error; err != nil {
		return nil, err
	}

	return processUnit, nil
}

func (r *Repository) DeleteProcessUnit(processUnit *models.ProcessUnits) error {
	return r.db.Delete(processUnit).Error
}

func (r *Repository) CreateProcessUnitConnection(connection *models.ProcessUnitConnections) (*models.ProcessUnitConnections, error) {
	if err := r.db.Create(connection).Error; err != nil {
		return nil, err
	}

	return connection, nil
}

func (r *Repository) FindProcessUnitConnectionsByPlantID(plantID uuid.UUID) ([]models.ProcessUnitConnections, error) {
	var connections []models.ProcessUnitConnections
	if err := r.db.Where("plant_id = ?", plantID).Order("created_at DESC").Find(&connections).Error; err != nil {
		return nil, err
	}

	return connections, nil
}

func (r *Repository) FindProcessUnitConnectionByID(connectionID uuid.UUID) (*models.ProcessUnitConnections, error) {
	var connection models.ProcessUnitConnections
	if err := r.db.Where("id = ?", connectionID).First(&connection).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &connection, nil
}

func (r *Repository) UpdateProcessUnitConnection(connection *models.ProcessUnitConnections) (*models.ProcessUnitConnections, error) {
	if err := r.db.Save(connection).Error; err != nil {
		return nil, err
	}

	return connection, nil
}

func (r *Repository) DeleteProcessUnitConnection(connection *models.ProcessUnitConnections) error {
	return r.db.Delete(connection).Error
}

func (r *Repository) DeleteProcessUnitConnectionsByUnitID(processUnitID uuid.UUID) error {
	return r.db.Where("source_unit_id = ? OR target_unit_id = ?", processUnitID, processUnitID).Delete(&models.ProcessUnitConnections{}).Error
}
