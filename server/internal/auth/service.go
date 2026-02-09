package auth

import (
	"plc-dashboard/models"
	appErr "plc-dashboard/pkg/errors"
	"plc-dashboard/pkg/jwt"
	"plc-dashboard/pkg/utils"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) SignUp(req SignUpRequest) (*JWTAuthResponse, string, error) {
	// Missing Required Validation
	if req.Email == "" ||
		req.UserName == "" || req.Password == "" || req.ConfirmPassword == "" {
		return nil, "", appErr.NewBadRequest("Missing required fields", nil)
	}

	// Existing User Validation
	existingUser, err := s.repo.FindUserByEmail(req.Email)
	if err != nil {
		return nil, "", appErr.NewBadRequest("Failed to verify if the email exists", err)
	}

	if existingUser != nil {
		return nil, "", appErr.NewBadRequest("User with that email already exists", nil)
	}

	// Password Validation
	if req.Password != req.ConfirmPassword {
		return nil, "", appErr.NewBadRequest("Password does not match", nil)
	}

	// Password Hashing
	hashedPasword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, "", appErr.NewBadRequest("Failed to hash the provided password", err)
	}

	newUser := &models.User{
		UserName: req.UserName,
		Email:    req.Email,
		Password: hashedPasword,
		Role:     "VIEWER",
		Language: "ZH-TW",
	}

	createdUser, err := s.repo.CreateUser(newUser)
	if err != nil {
		return nil, "", appErr.NewInternal("Failed to create a new user at the database", err)
	}

	signUpRes := JWTAuthResponse{
		ID:   createdUser.ID.String(),
		Role: string(createdUser.Role),
	}

	token, err := jwt.GenerateJWT(createdUser)
	if err != nil {
		return nil, "", appErr.NewInternal("Failed to generate token", err)
	}

	return &signUpRes, token, nil
}

func (s *Service) SignIn(req SignInRequest) (*JWTAuthResponse, string, error) {
	if req.Email == "" || req.Password == "" {
		return nil, "", appErr.NewBadRequest("Missing required fields", nil)
	}

	user, err := s.repo.FindUserByEmail(req.Email)
	if err != nil {
		return nil, "", appErr.NewNotFound("Failed to verify if user exists", err)
	}
	if user == nil {
		return nil, "", appErr.NewBadRequest("Invalid email or password", nil)
	}

	if err := utils.ValidatePassword(user.Password, req.Password); err != nil {
		return nil, "", appErr.NewBadRequest("Invalid email or password", err)
	}

	token, err := jwt.GenerateJWT(user)
	if err != nil {
		return nil, "", appErr.NewInternal("Failed to generate token", err)
	}

	signinRes := JWTAuthResponse{
		ID:   user.ID.String(),
		Role: string(user.Role),
	}

	return &signinRes, token, nil
}
