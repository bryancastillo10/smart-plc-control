package alert_rules

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

func (r *Repository) FindAlertRules() ([]models.AlertRules, error) {
	var alertRules []models.AlertRules
	if err := r.db.Order("created_at DESC").Find(&alertRules).Error; err != nil {
		return nil, err
	}

	return alertRules, nil
}

func (r *Repository) CreateAlertRule(alertRule *models.AlertRules) (*models.AlertRules, error) {
	if err := r.db.Create(alertRule).Error; err != nil {
		return nil, err
	}

	return alertRule, nil
}

func (r *Repository) UpdateAlertRule(alertRule *models.AlertRules) (*models.AlertRules, error) {
	if err := r.db.Save(alertRule).Error; err != nil {
		return nil, err
	}

	return alertRule, nil
}

func (r *Repository) DeleteAlertRule(alertRule *models.AlertRules) error {
	return r.db.Delete(alertRule).Error
}
