package user

import "time"

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
