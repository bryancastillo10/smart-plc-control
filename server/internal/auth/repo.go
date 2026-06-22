package auth

import (
	"context"
	"errors"

	"smart-plc-control-server/internal/models"

	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) ExistsByEmail(ctx context.Context, email string) (bool, error) {
	var user models.Users
	err := r.db.WithContext(ctx).
		Select("id").
		Where("email = ?", email).
		First(&user).
		Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return false, nil
	}
	if err != nil {
		return false, err
	}

	return true, nil
}

func (r *Repository) CreateUser(ctx context.Context, user *models.Users) error {
	return r.db.WithContext(ctx).Create(user).Error
}
