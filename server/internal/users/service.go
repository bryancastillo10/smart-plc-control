package users

import (
	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAllUsers() ([]UserResponse, error) {
	users, err := s.repo.FindAllUsers()
	if err != nil {
		return nil, appErr.NewInternal("Failed to get users", err)
	}

	res := make([]UserResponse, 0, len(users))
	for _, user := range users {
		res = append(res, toUserResponse(user))
	}

	return res, nil
}

func (s *Service) UpdateUser(userID string, req UpdateUserRequest) (*UserResponse, error) {
	if userID == "" {
		return nil, appErr.NewBadRequest("Missing user ID", nil)
	}

	if req.UserName == "" && req.Role == "" && req.Language == "" {
		return nil, appErr.NewBadRequest("Missing user fields to update", nil)
	}

	if req.Role != "" && req.Role != models.Admin && req.Role != models.Operator && req.Role != models.Viewer {
		return nil, appErr.NewBadRequest("Invalid Role", nil)
	}

	if req.Language != "" && req.Language != models.English && req.Language != models.Chinese {
		return nil, appErr.NewBadRequest("Invalid Language", nil)
	}

	user, err := s.repo.FindUserByID(userID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find user", err)
	}
	if user == nil {
		return nil, appErr.NewNotFound("User not found", nil)
	}

	if req.UserName != "" {
		user.UserName = req.UserName
	}
	if req.Role != "" {
		user.Role = req.Role
	}
	if req.Language != "" {
		user.Language = req.Language
	}

	updatedUser, err := s.repo.UpdateUser(user)
	if err != nil {
		return nil, appErr.NewInternal("Failed to update user", err)
	}

	res := toUserResponse(*updatedUser)
	return &res, nil
}

func toUserResponse(user models.Users) UserResponse {
	return UserResponse{
		ID:        user.ID.String(),
		UserName:  user.UserName,
		Email:     user.Email,
		Role:      user.Role,
		Language:  user.Language,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}
}
