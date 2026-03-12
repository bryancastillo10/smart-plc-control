package user

import (
	"plc-dashboard/models"
	"time"
)

type UserData struct {
	ID        string    `json:"id"`
	UserName  string    `json:"username"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	Language  string    `json:"language"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type UpdateUserRequest struct {
	UserName string `json:"username"`
	Language string `json:"lang"`
}

type DeleteUserRequest struct {
	UserName string `json:"username"`
}


func GetUserResponse(user *models.User) UserData {
	return UserData{
		ID:        user.ID.String(),
		UserName:  user.UserName,
		Email:     user.Email,
		Role:      string(user.Role),
		Language:  string(user.Language),
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
}