package tags

import (
	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
	"smart-plc-control-server/pkg/utils"

	"github.com/google/uuid"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetTagsByDeviceID(deviceID string) ([]TagResponse, error) {
	if deviceID == "" {
		return nil, appErr.NewBadRequest("Missing device ID", nil)
	}

	parsedDeviceID, err := utils.ParseId(deviceID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid device ID", err)
	}

	device, err := s.repo.FindDeviceByID(parsedDeviceID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find device", err)
	}
	if device == nil {
		return nil, appErr.NewNotFound("Device not found", nil)
	}

	tags, err := s.repo.FindTagsByDeviceID(parsedDeviceID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to get tags", err)
	}

	res := make([]TagResponse, 0, len(tags))
	for _, tag := range tags {
		res = append(res, toTagResponse(tag))
	}

	return res, nil
}

func (s *Service) GetTagsByProcessUnitID(processUnitID string) ([]TagResponse, error) {
	if processUnitID == "" {
		return nil, appErr.NewBadRequest("Missing process unit ID", nil)
	}

	parsedProcessUnitID, err := utils.ParseId(processUnitID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid process unit ID", err)
	}

	processUnit, err := s.repo.FindProcessUnitByID(parsedProcessUnitID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find process unit", err)
	}
	if processUnit == nil {
		return nil, appErr.NewNotFound("Process unit not found", nil)
	}

	tags, err := s.repo.FindTagsByProcessUnitID(parsedProcessUnitID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to get tags", err)
	}

	res := make([]TagResponse, 0, len(tags))
	for _, tag := range tags {
		res = append(res, toTagResponse(tag))
	}

	return res, nil
}

func (s *Service) CreateTag(deviceID string, req CreateTagRequest) (*TagResponse, error) {
	if deviceID == "" {
		return nil, appErr.NewBadRequest("Missing device ID", nil)
	}

	if req.Name == "" || req.DataType == "" {
		return nil, appErr.NewBadRequest("Missing required fields", nil)
	}

	if !isValidTagDataType(req.DataType) {
		return nil, appErr.NewBadRequest("Invalid tag data type", nil)
	}

	if req.ScanIntervalMS == 0 {
		req.ScanIntervalMS = 1000
	}
	if req.ScanIntervalMS < 1 {
		return nil, appErr.NewBadRequest("Invalid scan interval", nil)
	}

	if req.MinValue != nil && req.MaxValue != nil && *req.MinValue > *req.MaxValue {
		return nil, appErr.NewBadRequest("Minimum value cannot be greater than maximum value", nil)
	}

	parsedDeviceID, err := utils.ParseId(deviceID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid device ID", err)
	}

	device, err := s.repo.FindDeviceByID(parsedDeviceID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find device", err)
	}
	if device == nil {
		return nil, appErr.NewNotFound("Device not found", nil)
	}

	existingTag, err := s.repo.FindTagByDeviceIDAndName(parsedDeviceID, req.Name)
	if err != nil {
		return nil, appErr.NewInternal("Failed to verify tag name", err)
	}
	if existingTag != nil {
		return nil, appErr.NewBadRequest("Tag with that name already exists for the device", nil)
	}

	var processUnitID *uuid.UUID
	if req.ProcessUnitID != "" {
		parsedProcessUnitID, err := utils.ParseId(req.ProcessUnitID)
		if err != nil {
			return nil, appErr.NewBadRequest("Invalid process unit ID", err)
		}

		processUnit, err := s.repo.FindProcessUnitByID(parsedProcessUnitID)
		if err != nil {
			return nil, appErr.NewInternal("Failed to find process unit", err)
		}
		if processUnit == nil {
			return nil, appErr.NewNotFound("Process unit not found", nil)
		}
		if processUnit.PlantID != device.PlantID {
			return nil, appErr.NewBadRequest("Process unit must belong to the same plant as the device", nil)
		}

		processUnitID = &parsedProcessUnitID
	}

	readOnly := true
	if req.ReadOnly != nil {
		readOnly = *req.ReadOnly
	}

	enabled := true
	if req.Enabled != nil {
		enabled = *req.Enabled
	}

	tag := &models.Tags{
		ID:             utils.GenerateUUID(),
		DeviceID:       parsedDeviceID,
		ProcessUnitID:  processUnitID,
		Name:           req.Name,
		Address:        req.Address,
		DataType:       req.DataType,
		Unit:           req.Unit,
		Description:    req.Description,
		ReadOnly:       readOnly,
		ScanIntervalMS: req.ScanIntervalMS,
		MinValue:       req.MinValue,
		MaxValue:       req.MaxValue,
		Enabled:        enabled,
	}

	createdTag, err := s.repo.CreateTag(tag)
	if err != nil {
		return nil, appErr.NewInternal("Failed to create tag", err)
	}

	res := toTagResponse(*createdTag)
	return &res, nil
}

func toTagResponse(tag models.Tags) TagResponse {
	var processUnitID *string
	if tag.ProcessUnitID != nil {
		id := tag.ProcessUnitID.String()
		processUnitID = &id
	}

	return TagResponse{
		ID:             tag.ID.String(),
		DeviceID:       tag.DeviceID.String(),
		ProcessUnitID:  processUnitID,
		Name:           tag.Name,
		Address:        tag.Address,
		DataType:       tag.DataType,
		Unit:           tag.Unit,
		Description:    tag.Description,
		ReadOnly:       tag.ReadOnly,
		ScanIntervalMS: tag.ScanIntervalMS,
		MinValue:       tag.MinValue,
		MaxValue:       tag.MaxValue,
		Enabled:        tag.Enabled,
		CreatedAt:      tag.CreatedAt,
		UpdatedAt:      tag.UpdatedAt,
	}
}

func isValidTagDataType(dataType models.TagDataType) bool {
	return dataType == models.BoolDataType ||
		dataType == models.IntDataType ||
		dataType == models.FloatDataType ||
		dataType == models.StringDataType
}
