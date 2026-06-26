package users

import (
	"smart-plc-control-server/internal/models"
	"time"
)

type UpdateUserRequest struct {
	UserName string          `json:"username" binding:"omitempty,min=3,max=100"`
	Role     models.Role     `json:"role" binding:"omitempty,oneof=ADMIN OPERATOR VIEWER"`
	Language models.Language `json:"language" binding:"omitempty,oneof=EN ZH-TW"`
}

type UserResponse struct {
	ID        string          `json:"id"`
	UserName  string          `json:"username"`
	Email     string          `json:"email"`
	Role      models.Role     `json:"role"`
	Language  models.Language `json:"language"`
	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
}
