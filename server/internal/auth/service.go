package auth

import (
	"context"
	"errors"
	"strings"

	"smart-plc-control-server/internal/models"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrEmailAlreadyExists = errors.New("email already exists")
	ErrInvalidRole        = errors.New("invalid role")
	ErrInvalidLanguage    = errors.New("invalid language")
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) Register(ctx context.Context, req RegisterRequest) (*UserResponse, error) {
	email := strings.ToLower(strings.TrimSpace(req.Email))
	exists, err := s.repo.ExistsByEmail(ctx, email)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, ErrEmailAlreadyExists
	}

	role, err := normalizeRole(req.Role)
	if err != nil {
		return nil, err
	}

	language, err := normalizeLanguage(req.Language)
	if err != nil {
		return nil, err
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.Users{
		ID:           uuid.New(),
		UserName:     strings.TrimSpace(req.UserName),
		Email:        email,
		PasswordHash: string(passwordHash),
		Role:         role,
		Language:     language,
	}

	if err := s.repo.CreateUser(ctx, user); err != nil {
		return nil, err
	}

	return toUserResponse(user), nil
}

func normalizeRole(value string) (models.Role, error) {
	switch models.Role(strings.ToUpper(strings.TrimSpace(value))) {
	case "":
		return models.Viewer, nil
	case models.Admin:
		return models.Admin, nil
	case models.Operator:
		return models.Operator, nil
	case models.Viewer:
		return models.Viewer, nil
	default:
		return "", ErrInvalidRole
	}
}

func normalizeLanguage(value string) (models.Language, error) {
	switch models.Language(strings.ToUpper(strings.TrimSpace(value))) {
	case "":
		return models.English, nil
	case models.English:
		return models.English, nil
	case models.Chinese:
		return models.Chinese, nil
	default:
		return "", ErrInvalidLanguage
	}
}

func toUserResponse(user *models.Users) *UserResponse {
	return &UserResponse{
		ID:        user.ID,
		UserName:  user.UserName,
		Email:     user.Email,
		Role:      string(user.Role),
		Language:  string(user.Language),
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
}
