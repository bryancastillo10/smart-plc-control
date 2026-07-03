package auth

import (
	"smart-plc-control-server/internal/models"
	"time"
)

type SignUpRequest struct {
	UserName        string      `json:"username" binding:"required,min=3,max=100"`
	Email           string      `json:"email" binding:"required,email,max=255"`
	Password        string      `json:"password" binding:"required"`
	ConfirmPassword string      `json:"confirmPassword" binding:"required"`
	Role            models.Role `json:"role"`
	Language        string      `json:"language" binding:"omitempty,oneof=EN ZH-TW"`
}

type SignInRequest struct {
	Email    string `json:"email" binding:"required,email,max=255"`
	Password string `json:"password" binding:"required"`
}

type JWTAuthResponse struct {
	ID   string `json:"id"`
	Role string `json:"role" binding:"omitempty,oneof=ADMIN OPERATOR VIEWER"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type CurrentUserResponse struct {
	ID            string          `json:"id"`
	UserName      string          `json:"username"`
	Email         string          `json:"email"`
	Role          models.Role     `json:"role"`
	Language      models.Language `json:"language"`
	CreatedAt     time.Time       `json:"created_at"`
	UpdatedAt     time.Time       `json:"updated_at"`
	HasOwnedPlant bool            `json:"hasOwnedPlant"`
}
