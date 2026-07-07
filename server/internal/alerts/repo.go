package alerts

import (
	"smart-plc-control-server/internal/models"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

type AlertFilters struct {
	Status      *models.AlertStatus
	Severity    *models.AlertSeverity
	PlantID     *uuid.UUID
	AlertRuleID *uuid.UUID
	From        *time.Time
	To          *time.Time
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

func (r *Repository) FindAlertRuleByID(ruleID uuid.UUID) (*models.AlertRules, error) {
	var alertRule models.AlertRules
	if err := r.db.Where("id = ?", ruleID).First(&alertRule).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &alertRule, nil
}

func (r *Repository) FindAlerts(filters AlertFilters) ([]models.Alerts, error) {
	var alerts []models.Alerts
	query := r.db.Model(&models.Alerts{}).Preload("AlertRule")

	if filters.Severity != nil || filters.PlantID != nil {
		query = query.Joins("JOIN alert_rules ON alert_rules.id = alerts.alert_rule_id")
	}
	if filters.PlantID != nil {
		query = query.Joins("JOIN tags ON tags.id = alert_rules.tag_id").
			Joins("JOIN devices ON devices.id = tags.device_id").
			Where("devices.plant_id = ?", *filters.PlantID)
	}
	if filters.AlertRuleID != nil {
		query = query.Where("alerts.alert_rule_id = ?", *filters.AlertRuleID)
	}
	if filters.Status != nil {
		query = query.Where("alerts.status = ?", *filters.Status)
	}
	if filters.Severity != nil {
		query = query.Where("alert_rules.severity = ?", *filters.Severity)
	}
	if filters.From != nil {
		query = query.Where("alerts.triggered_at >= ?", *filters.From)
	}
	if filters.To != nil {
		query = query.Where("alerts.triggered_at <= ?", *filters.To)
	}

	if err := query.Order("alerts.triggered_at DESC, alerts.id DESC").Find(&alerts).Error; err != nil {
		return nil, err
	}

	return alerts, nil
}
