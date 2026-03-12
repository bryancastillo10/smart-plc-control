package user

import (
	appErr "plc-dashboard/pkg/errors"
	"plc-dashboard/pkg/utils"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}



func (s *Service) GetUser(userID string) (*UserData, error) {
	uid, err := utils.ParseId(userID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid user ID", err)
	}

	user, err := s.repo.FindUserByID(uid)
	if err != nil {
		return nil, appErr.NewInternal("Failed to retrieve user", err)
	}
	if user == nil {
		return nil, appErr.NewNotFound("User not found", nil)
	}

	response := GetUserResponse(user)

	return &response, nil
}
