package auth

type SignUpRequest struct {
	UserName        string `json:"username"`
	Email           string `json:"email"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
}

type JWTAuthResponse struct {
	ID   string `json:"userId"`
	Role string `json:"role"`
}

type SignInRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
