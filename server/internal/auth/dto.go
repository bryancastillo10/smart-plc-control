package auth

import (
	"time"

	"github.com/google/uuid"
)

type RegisterRequest struct {
	UserName string `json:"username" binding:"required,min=3,max=100"`
	Email    string `json:"email" binding:"required,email,max=255"`
	Password string `json:"password" binding:"required,min=8"`
	Role     string `json:"role" binding:"omitempty,oneof=ADMIN OPERATOR VIEWER"`
	Language string `json:"language" binding:"omitempty,oneof=EN ZH-TW"`
}

type UserResponse struct {
	ID        uuid.UUID `json:"id"`
	UserName  string    `json:"username"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	Language  string    `json:"language"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}
