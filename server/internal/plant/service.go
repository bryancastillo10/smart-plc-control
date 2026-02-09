package plant

import (
	appErr "plc-dashboard/pkg/errors"

	"plc-dashboard/models"
	"plc-dashboard/pkg/utils"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreatePlant(
	req CreatePlantRequest,
	adminID string,
) (*models.Plant, error) {
	uid, err := utils.ParseId(adminID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid ID", err)
	}

	plant := &models.Plant{
		Name:        req.Name,
		Location:    req.Location,
		Description: req.Description,
	}

	settings := &models.PlantSettings{
		UpdatedBy:   uid,
		Interval:    req.Settings.Interval,
		NoiseFactor: req.Settings.NoiseFactor,
	}

	valves := make([]models.Valve, 0, len(req.Valves))

	for _, v := range req.Valves {

		valve := models.Valve{
			Name:        v.Name,
			Location:    v.Location,
			Description: v.Description,
			Position:    utils.DefaultFloat(v.Position, 0.0),
			IsAuto:      utils.DefaultBool(v.IsAuto, true),
		}

		valves = append(valves, valve)
	}

	plant, err = s.repo.CreatePlantWithRelations(plant, settings, valves)
	if err != nil {
		return nil, appErr.NewInternal("Failed to create the plant with settings and valves", err)
	}

	return plant, nil
}
