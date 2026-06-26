package users

import (
	"smart-plc-control-server/internal/models"

	"gorm.io/gorm"
)

type Repository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) FindAllUsers() ([]models.Users, error) {
	var users []models.Users
	if err := r.db.Order("created_at DESC").Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

func (r *Repository) FindUserByID(userID string) (*models.Users, error) {
	var user models.Users
	if err := r.db.Where("id = ?", userID).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (r *Repository) UpdateUser(user *models.Users) (*models.Users, error) {
	if err := r.db.Save(user).Error; err != nil {
		return nil, err
	}

	return user, nil
}

func (r *Repository) DeleteUser(user *models.Users) error {
	return r.db.Delete(user).Error
}
