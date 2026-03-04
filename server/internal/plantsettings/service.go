package plantsettings

import (
	"plc-dashboard/models"
	appErr "plc-dashboard/pkg/errors"
	"plc-dashboard/pkg/utils"

	"github.com/google/uuid"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func mapPlantSettingsResponse(settings *models.PlantSettings) PlantSettingsResponse {
	updatedBy := ""
	if settings.UpdatedByUser.ID != uuid.Nil {
		updatedBy = settings.UpdatedByUser.UserName
	}

	return PlantSettingsResponse{
		ID:          settings.ID.String(),
		PlantID:     settings.PlantID.String(),
		UpdatedBy:   updatedBy,
		Interval:    settings.Interval,
		NoiseFactor: settings.NoiseFactor,
	}
}

func (s *Service) GetPlantSettings(plantId string) (*PlantSettingsResponse, error) {
	pid, err := utils.ParseId(plantId)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid Plant ID", err)
	}

	settings, err := s.repo.GetPlantSettingsByPlantID(pid)
	if err != nil {
		return nil, appErr.NewInternal("Failed to retrieve plant settings", err)
	}
	if settings == nil {
		return nil, appErr.NewNotFound("Plant settings not found", nil)
	}

	response := mapPlantSettingsResponse(settings)
	return &response, nil
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
