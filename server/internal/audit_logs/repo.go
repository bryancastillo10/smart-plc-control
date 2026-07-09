package audit_logs

import (
	"smart-plc-control-server/internal/models"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

type AuditLogFilters struct {
	UserID     *uuid.UUID
	Action     string
	EntityType string
	EntityID   *uuid.UUID
	From       *time.Time
	To         *time.Time
	Limit      int
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindUserByID(userID uuid.UUID) (*models.Users, error) {
	var user models.Users
	if err := r.db.Where("id = ?", userID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (r *Repository) FindAuditLogs(filters AuditLogFilters) ([]models.AuditLogs, error) {
	var auditLogs []models.AuditLogs
	query := r.db.Model(&models.AuditLogs{}).Preload("User")

	if filters.UserID != nil {
		query = query.Where("user_id = ?", *filters.UserID)
	}
	if filters.Action != "" {
		query = query.Where("action = ?", filters.Action)
	}
	if filters.EntityType != "" {
		query = query.Where("entity_type = ?", filters.EntityType)
	}
	if filters.EntityID != nil {
		query = query.Where("entity_id = ?", *filters.EntityID)
	}
	if filters.From != nil {
		query = query.Where("created_at >= ?", *filters.From)
	}
	if filters.To != nil {
		query = query.Where("created_at <= ?", *filters.To)
	}
	if filters.Limit > 0 {
		query = query.Limit(filters.Limit)
	}

	if err := query.Order("created_at DESC, id DESC").Find(&auditLogs).Error; err != nil {
		return nil, err
	}

	return auditLogs, nil
}

func (r *Repository) FindAuditLogByID(auditLogID uint64) (*models.AuditLogs, error) {
	var auditLog models.AuditLogs
	if err := r.db.Preload("User").Where("id = ?", auditLogID).First(&auditLog).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &auditLog, nil
}
