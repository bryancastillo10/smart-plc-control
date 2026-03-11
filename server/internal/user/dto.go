package user

type UserData struct {
	UserName	string `json:"username"`
	Email	string `json:"email"`
	Role	string `json:"role"`
	Language	string `json:"lang"`
}

type UpdateUserRequest struct {
	UserName	string `json:"username"`
	Language	string `json:"lang"`
}

type DeleteUserRequest struct {
	UserName string `json:"username"`
}