package auth

import (
	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
	"smart-plc-control-server/pkg/utils"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) SignUp(req SignUpRequest) (*JWTAuthResponse, string, error) {
	// Missing Required Validation
	if req.Email == "" || req.UserName == "" || req.Role == "" {
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

	// Role Validation
	if req.Role != "ADMIN" && req.Role != "OPERATOR" && req.Role != "VIEWER" {
		return nil, "", appErr.NewBadRequest("Invalid Role", nil)
	}

	// Password Validation
	if req.Password != req.ConfirmPassword {
		return nil, "", appErr.NewBadRequest("Password does not match", nil)
	}

	// Password Hashing
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, "", appErr.NewInternal("Failed to hash the password", nil)
	}

	// Register User Data Preparation
	userId := utils.GenerateUUID()

	newUser := &models.Users{
		ID:           userId,
		UserName:     req.UserName,
		Email:        req.Email,
		PasswordHash: hashedPassword,
		Role:         req.Role,
		Language:     "EN",
	}

	createdUser, err := s.repo.CreateUser(newUser)
	if err != nil {
		return nil, "", appErr.NewInternal("Failed to create the user", err)
	}

	registeredUserRes := JWTAuthResponse{
		ID:   createdUser.ID.String(),
		Role: string(createdUser.Role),
	}

	token, err := utils.GenerateJWT(createdUser)
	if err != nil {
		return nil, "", appErr.NewInternal("Failed to generate token", err)
	}

	return &registeredUserRes, token, nil
}
