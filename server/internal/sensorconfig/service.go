package sensorconfig

import (
	"errors"
	appErr "plc-dashboard/pkg/errors"
	"plc-dashboard/pkg/utils"

	"plc-dashboard/models"
	"gorm.io/gorm"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func mapSensorConfigResponse(config models.SensorConfig) SensorConfigResponse {
	return SensorConfigResponse{
		ID:          config.ID.String(),
		PlantID:     config.PlantID.String(),
		ValveID:     config.ValveID,
		Sensor:      config.Sensor,
		BaseMin:     config.BaseMin,
		BaseMax:     config.BaseMax,
		EffectScale: config.EffectScale,
	}
}

func (s *Service) ListSensorConfigs(plantID string) ([]SensorConfigResponse, error) {
	pid, err := utils.ParseId(plantID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid plant ID", err)
	}

	configs, err := s.repo.ListByPlantID(pid)
	if err != nil {
		return nil, appErr.NewInternal("Failed to retrieve sensor configs", err)
	}

	response := make([]SensorConfigResponse, 0, len(configs))
	for _, cfg := range configs {
		response = append(response, mapSensorConfigResponse(cfg))
	}

	return response, nil
}

func (s *Service) GetSensorConfig(plantID string, configID string) (*SensorConfigResponse, error) {
	pid, err := utils.ParseId(plantID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid plant ID", err)
	}

	cid, err := utils.ParseId(configID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid config ID", err)
	}

	config, err := s.repo.GetByID(pid, cid)
	if err != nil {
		return nil, appErr.NewInternal("Failed to retrieve sensor config", err)
	}
	if config == nil {
		return nil, appErr.NewNotFound("Sensor config not found", nil)
	}

	response := mapSensorConfigResponse(*config)
	return &response, nil
}

func (s *Service) CreateSensorConfig(req CreateSensorConfigRequest, plantID string) (*SensorConfigResponse, error) {
	pid, err := utils.ParseId(plantID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid plant ID", err)
	}

	config := &models.SensorConfig{
		PlantID:     pid,
		ValveID:     req.ValveID,
		Sensor:      req.Sensor,
		BaseMin:     req.BaseMin,
		BaseMax:     req.BaseMax,
		EffectScale: req.EffectScale,
	}

	if err := s.repo.Create(config); err != nil {
		return nil, appErr.NewInternal("Failed to create sensor config", err)
	}

	response := mapSensorConfigResponse(*config)
	return &response, nil
}

func (s *Service) UpdateSensorConfig(req UpdateSensorConfigRequest, plantID string, configID string) (*SensorConfigResponse, error) {
	pid, err := utils.ParseId(plantID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid plant ID", err)
	}

	cid, err := utils.ParseId(configID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid config ID", err)
	}

	config, err := s.repo.GetByID(pid, cid)
	if err != nil {
		return nil, appErr.NewInternal("Failed to retrieve sensor config", err)
	}
	if config == nil {
		return nil, appErr.NewNotFound("Sensor config not found", nil)
	}

	if req.ValveID != nil {
		config.ValveID = req.ValveID
	}
	if req.Sensor != nil {
		config.Sensor = *req.Sensor
	}
	if req.BaseMin != nil {
		config.BaseMin = *req.BaseMin
	}
	if req.BaseMax != nil {
		config.BaseMax = *req.BaseMax
	}
	if req.EffectScale != nil {
		config.EffectScale = *req.EffectScale
	}

	if err := s.repo.Update(config); err != nil {
		return nil, appErr.NewInternal("Failed to update sensor config", err)
	}

	response := mapSensorConfigResponse(*config)
	return &response, nil
}

func (s *Service) DeleteSensorConfig(plantID string, configID string) error {
	pid, err := utils.ParseId(plantID)
	if err != nil {
		return appErr.NewBadRequest("Invalid plant ID", err)
	}

	cid, err := utils.ParseId(configID)
	if err != nil {
		return appErr.NewBadRequest("Invalid config ID", err)
	}

	if err := s.repo.Delete(pid, cid); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return appErr.NewNotFound("Sensor config not found", nil)
		}
		return appErr.NewInternal("Failed to delete sensor config", err)
	}

	return nil
}
