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
	// Missing Required Field Validation
	if req.Email == "" || req.UserName == "" || req.Role == "" {
		return nil, "", appErr.NewBadRequest("Missing required fields", nil)
	}

	// Existing User Validation
	user, err := s.repo.FindUserByEmail(req.Email)
	if err != nil {
		return nil, "", appErr.NewNotFound("Failed to verify if user exists", err)
	}
	if user == nil {
		return nil, "", appErr.NewBadRequest("Invalid email or password", nil)
	}

	// Password Validation
	if err := utils.ValidatePassword(user.PasswordHash, req.Password); err != nil {
		return nil, "", appErr.NewBadRequest("Invalid email or password", nil)
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

func (s *Service) LogIn(req SignInRequest) (*JWTAuthResponse, string, error) {
	// Missing Required Field Validation
	if req.Email == "" || req.Password == "" {
		return nil, "", appErr.NewBadRequest("Missing required fields", nil)
	}

	// Validate if user exists
	user, err := s.repo.FindUserByEmail(req.Email)
	if err != nil {
		return nil, "", appErr.NewNotFound("Failed to verify if user exists", err)
	}
	if user == nil {
		return nil, "", appErr.NewBadRequest("Invalid email or password", nil)
	}

	// JWT Token Generation
	token, err := utils.GenerateJWT(user)
	if err != nil {
		return nil, "", appErr.NewInternal("Failed to generate token", err)
	}

	// Return Data
	userResp := JWTAuthResponse{
		ID:   user.ID.String(),
		Role: string(user.Role),
	}

	return &userResp, token, nil
}
