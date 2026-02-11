package plantsettings

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

func (s *Service) UpdatePlantSettings(req UpdatePlantSettingsRequest, plantId string, userId string) error {
	pid, err := utils.ParseId(plantId)
	if err != nil {
		return appErr.NewBadRequest("Invalid Plant ID", err)
	}

	uid, err := utils.ParseId(userId)
	if err != nil {
		return appErr.NewBadRequest("Invalid User ID", err)
	}

	settings, err := s.repo.FindPlantSettingsByPlantID(pid)
	if err != nil {
		return appErr.NewInternal("Failed to retrieve plant settings", err)
	}
	if settings == nil {
		return appErr.NewNotFound("Plant settings not found", nil)
	}

	settings.Interval = req.Interval
	settings.NoiseFactor = req.NoiseFactor
	settings.UpdatedBy = uid

	if err := s.repo.UpdatePlantSettings(settings); err != nil {
		return appErr.NewInternal("Failed to update plant settings", err)
	}

	return nil
}
