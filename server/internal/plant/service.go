package plant

import (
	"plc-dashboard/models"

	"github.com/google/uuid"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreatePlant(
	adminID uuid.UUID,
	req CreatePlantRequest,
) (*models.Plant, error) {

	plant := &models.Plant{
		Name:        req.Name,
		Location:    req.Location,
		Description: req.Description,
	}

	settings := &models.PlantSettings{
		PlantID:     plant.ID,
		UpdatedBy:   adminID,
		Interval:    req.Settings.Interval,
		NoiseFactor: req.Settings.NoiseFactor,
	}

	valves := make([]models.Valve, 0, len(req.Valves))

	for _, v := range req.Valves {

		valve := models.Valve{
			PlantID:     plant.ID,
			Name:        v.Name,
			Location:    v.Location,
			Description: v.Description,
			Position:    defaultFloat(v.Position, 0.0),
			IsAuto:      defaultBool(v.IsAuto, true),
		}

		valves = append(valves, valve)
	}

	if err := s.repo.CreatePlantWithRelations(
		plant,
		settings,
		valves,
	); err != nil {
		return nil, err
	}

	return plant, nil
}

// Helper Functions
func defaultFloat(v *float64, def float64) float64 {
	if v != nil {
		return *v
	}
	return def
}

func defaultBool(v *bool, def bool) bool {
	if v != nil {
		return *v
	}
	return def
}
