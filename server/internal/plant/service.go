package plant

import (
	appErr "plc-dashboard/pkg/errors"

	"plc-dashboard/models"
	"plc-dashboard/pkg/utils"

	"github.com/google/uuid"
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

func (s *Service) GetAllPlants() ([]GetPlantListResponse, error) {
	plants, err := s.repo.GetAllPlants()
	if err != nil {
		return nil, appErr.NewInternal("Failed to get all the treatment plants", err)
	}

	responses := make([]GetPlantListResponse, 0, len(plants))

	for _, plant := range plants {

		updatedBy := ""
		if plant.Settings.UpdatedByUser.ID != uuid.Nil {
			updatedBy = plant.Settings.UpdatedByUser.UserName
		}

		settingsResp := PlantSettingsResponse{
			ID:          plant.Settings.ID.String(),
			UpdatedBy:   updatedBy,
			Interval:    plant.Settings.Interval,
			NoiseFactor: plant.Settings.NoiseFactor,
		}

		responses = append(responses, GetPlantListResponse{
			ID:          plant.ID.String(),
			Name:        plant.Name,
			Location:    plant.Location,
			Description: plant.Description,
			Settings:    settingsResp,
			ValveCount:  len(plant.Valves),
		})
	}

	return responses, nil

}

func (s *Service) GetPlantByID(plantId string) (GetPlantResponse, error) {
	plid, err := utils.ParseId(plantId)
	if err != nil {
		return GetPlantResponse{}, appErr.NewBadRequest("Invalid plant ID", err)
	}

	plant, err := s.repo.GetPlantByID(plid)
	if err != nil {
		return GetPlantResponse{}, appErr.NewInternal("Failed to retrieve the treatment plant", err)
	}

	if plant == nil {
		return GetPlantResponse{}, appErr.NewNotFound("Treatment plant not found", err)
	}

	updatedBy := ""
	if plant.Settings.UpdatedByUser.ID != uuid.Nil {
		updatedBy = plant.Settings.UpdatedByUser.UserName
	}

	settingsResp := PlantSettingsResponse{
		ID:          plant.Settings.ID.String(),
		UpdatedBy:   updatedBy,
		Interval:    plant.Settings.Interval,
		NoiseFactor: plant.Settings.NoiseFactor,
	}

	valvesResp := make([]ValveItem, 0, len(plant.Valves))
	for _, v := range plant.Valves {
		position := v.Position
		isAuto := v.IsAuto

		valvesResp = append(valvesResp, ValveItem{
			ID:          v.ID.String(),
			Name:        v.Name,
			Location:    v.Location,
			Description: v.Description,
			Position:    &position,
			IsAuto:      &isAuto,
		})
	}

	response := GetPlantResponse{
		Name:        plant.Name,
		Location:    plant.Location,
		Description: plant.Description,
		Settings:    settingsResp,
		Valve:       valvesResp,
	}

	return response, nil
}
