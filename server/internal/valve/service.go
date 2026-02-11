package valve

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

func (s *Service) UpdateValveSettings(req UpdateValveRequest, plantId string, valveId string) error {
	pid, err := utils.ParseId(plantId)
	if err != nil {
		return appErr.NewBadRequest("Invalid plant ID", err)
	}

	vid, err := utils.ParseId(valveId)
	if err != nil {
		return appErr.NewBadRequest("Invalid valve ID", err)
	}

	valve, err := s.repo.FindValveByID(pid, vid)
	if err != nil {
		return appErr.NewNotFound("Valve not found in this plant", err)
	}

	if req.Position != nil {
		valve.Position = *req.Position
	}

	if req.IsAuto != nil {
		valve.IsAuto = *req.IsAuto
	}

	if err := s.repo.UpdateValveSettings(valve); err != nil {
		return appErr.NewInternal("Failed to update valve", err)
	}

	return nil
}
