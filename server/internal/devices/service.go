package devices

import (
	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
	"smart-plc-control-server/pkg/utils"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAllDevices() ([]DeviceResponse, error) {
	devices, err := s.repo.FindAllDevices()
	if err != nil {
		return nil, appErr.NewInternal("Failed to get devices", err)
	}

	res := make([]DeviceResponse, 0, len(devices))
	for _, device := range devices {
		res = append(res, toDeviceResponse(device))
	}

	return res, nil
}

func (s *Service) CreateDevice(req CreateDeviceRequest) (*DeviceResponse, error) {
	if req.PlantID == "" || req.Name == "" || req.Type == "" || req.Protocol == "" {
		return nil, appErr.NewBadRequest("Missing required fields", nil)
	}

	if req.Type != models.PLC && req.Type != models.DeviceSimulator {
		return nil, appErr.NewBadRequest("Invalid device type", nil)
	}

	if req.Protocol != models.Simulator && req.Protocol != models.ModbusTCP && req.Protocol != models.OPCUA {
		return nil, appErr.NewBadRequest("Invalid device protocol", nil)
	}

	if req.Type == models.DeviceSimulator && req.Protocol != models.Simulator {
		return nil, appErr.NewBadRequest("Simulated devices must use SIMULATOR protocol", nil)
	}

	if req.Type == models.PLC && req.Protocol == models.Simulator {
		return nil, appErr.NewBadRequest("PLC devices must use a PLC protocol", nil)
	}

	if req.Port != nil && (*req.Port < 1 || *req.Port > 65535) {
		return nil, appErr.NewBadRequest("Invalid device port", nil)
	}

	parsedPlantID, err := utils.ParseId(req.PlantID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid plant ID", err)
	}

	plant, err := s.repo.FindPlantByID(parsedPlantID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find plant", err)
	}
	if plant == nil {
		return nil, appErr.NewNotFound("Plant not found", nil)
	}

	if req.ConnectionStatus == "" {
		req.ConnectionStatus = models.Disconnected
	}

	if req.ConnectionStatus != models.Connected && req.ConnectionStatus != models.Disconnected && req.ConnectionStatus != models.Connecting && req.ConnectionStatus != models.Error {
		return nil, appErr.NewBadRequest("Invalid device connection status", nil)
	}

	enabled := true
	if req.Enabled != nil {
		enabled = *req.Enabled
	}

	device := &models.Devices{
		ID:               utils.GenerateUUID(),
		PlantID:          parsedPlantID,
		Name:             req.Name,
		Type:             req.Type,
		Description:      req.Description,
		Protocol:         req.Protocol,
		Host:             req.Host,
		Port:             req.Port,
		ConnectionStatus: req.ConnectionStatus,
		Enabled:          enabled,
	}

	createdDevice, err := s.repo.CreateDevice(device)
	if err != nil {
		return nil, appErr.NewInternal("Failed to create device", err)
	}

	res := toDeviceResponse(*createdDevice)
	return &res, nil
}

func toDeviceResponse(device models.Devices) DeviceResponse {
	return DeviceResponse{
		ID:               device.ID.String(),
		PlantID:          device.PlantID.String(),
		Name:             device.Name,
		Type:             device.Type,
		Description:      device.Description,
		Protocol:         device.Protocol,
		Host:             device.Host,
		Port:             device.Port,
		ConnectionStatus: device.ConnectionStatus,
		Enabled:          device.Enabled,
		LastConnectedAt:  device.LastConnectedAt,
		CreatedAt:        device.CreatedAt,
		UpdatedAt:        device.UpdatedAt,
	}
}
