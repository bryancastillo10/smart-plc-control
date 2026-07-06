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

func (s *Service) GetTagByID(tagID string) (*TagDetailResponse, error) {
	if tagID == "" {
		return nil, appErr.NewBadRequest("Missing tag ID", nil)
	}

	parsedTagID, err := utils.ParseId(tagID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid tag ID", err)
	}

	tag, err := s.repo.FindTagByID(parsedTagID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find tag", err)
	}
	if tag == nil {
		return nil, appErr.NewNotFound("Tag not found", nil)
	}

	latestReading, err := s.repo.FindLatestReadingByTagID(parsedTagID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find latest tag reading", err)
	}

	res := toTagDetailResponse(*tag, latestReading)
	return &res, nil
}

func (s *Service) GetTags(query ListTagsQuery) ([]TagResponse, error) {
	filters := TagFilters{
		Enabled: query.Enabled,
	}

	if query.PlantID != "" {
		parsedPlantID, err := utils.ParseId(query.PlantID)
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

		filters.PlantID = &parsedPlantID
	}

	if query.DeviceID != "" {
		parsedDeviceID, err := utils.ParseId(query.DeviceID)
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
		if filters.PlantID != nil && device.PlantID != *filters.PlantID {
			return nil, appErr.NewBadRequest("Device must belong to the filtered plant", nil)
		}

		filters.DeviceID = &parsedDeviceID
	}

	if query.ProcessUnitID != "" {
		parsedProcessUnitID, err := utils.ParseId(query.ProcessUnitID)
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
		if filters.PlantID != nil && processUnit.PlantID != *filters.PlantID {
			return nil, appErr.NewBadRequest("Process unit must belong to the filtered plant", nil)
		}

		filters.ProcessUnitID = &parsedProcessUnitID
	}

	tags, err := s.repo.FindTags(filters)
	if err != nil {
		return nil, appErr.NewInternal("Failed to get tags", err)
	}

	return toTagResponses(tags), nil
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

	return toTagResponses(tags), nil
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

	return toTagResponses(tags), nil
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

func (s *Service) UpdateTag(tagID string, req UpdateTagRequest) (*TagResponse, error) {
	if tagID == "" {
		return nil, appErr.NewBadRequest("Missing tag ID", nil)
	}

	if req.ProcessUnitID == "" && req.Name == "" && req.Address == "" && req.DataType == "" && req.Unit == "" && req.Description == "" && req.ReadOnly == nil && req.ScanIntervalMS == 0 && req.MinValue == nil && req.MaxValue == nil && req.Enabled == nil {
		return nil, appErr.NewBadRequest("Missing tag fields to update", nil)
	}

	if req.DataType != "" && !isValidTagDataType(req.DataType) {
		return nil, appErr.NewBadRequest("Invalid tag data type", nil)
	}
	if req.ScanIntervalMS < 0 {
		return nil, appErr.NewBadRequest("Invalid scan interval", nil)
	}

	parsedTagID, err := utils.ParseId(tagID)
	if err != nil {
		return nil, appErr.NewBadRequest("Invalid tag ID", err)
	}

	tag, err := s.repo.FindTagByID(parsedTagID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find tag", err)
	}
	if tag == nil {
		return nil, appErr.NewNotFound("Tag not found", nil)
	}

	if req.Name != "" && req.Name != tag.Name {
		existingTag, err := s.repo.FindTagByDeviceIDAndName(tag.DeviceID, req.Name)
		if err != nil {
			return nil, appErr.NewInternal("Failed to verify tag name", err)
		}
		if existingTag != nil && existingTag.ID != tag.ID {
			return nil, appErr.NewBadRequest("Tag with that name already exists for the device", nil)
		}
	}

	if req.ProcessUnitID != "" {
		parsedProcessUnitID, err := utils.ParseId(req.ProcessUnitID)
		if err != nil {
			return nil, appErr.NewBadRequest("Invalid process unit ID", err)
		}

		device, err := s.repo.FindDeviceByID(tag.DeviceID)
		if err != nil {
			return nil, appErr.NewInternal("Failed to find device", err)
		}
		if device == nil {
			return nil, appErr.NewNotFound("Device not found", nil)
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

		tag.ProcessUnitID = &parsedProcessUnitID
	}

	utils.PatchIfNotZero(&tag.Name, req.Name)
	utils.PatchIfNotZero(&tag.Address, req.Address)
	utils.PatchIfNotZero(&tag.DataType, req.DataType)
	utils.PatchIfNotZero(&tag.Unit, req.Unit)
	utils.PatchIfNotZero(&tag.Description, req.Description)
	utils.PatchIfNotZero(&tag.ScanIntervalMS, req.ScanIntervalMS)
	if req.ReadOnly != nil {
		tag.ReadOnly = *req.ReadOnly
	}
	if req.MinValue != nil {
		tag.MinValue = req.MinValue
	}
	if req.MaxValue != nil {
		tag.MaxValue = req.MaxValue
	}
	if req.Enabled != nil {
		tag.Enabled = *req.Enabled
	}

	if tag.ScanIntervalMS < 1 {
		return nil, appErr.NewBadRequest("Invalid scan interval", nil)
	}
	if tag.MinValue != nil && tag.MaxValue != nil && *tag.MinValue > *tag.MaxValue {
		return nil, appErr.NewBadRequest("Minimum value cannot be greater than maximum value", nil)
	}

	updatedTag, err := s.repo.UpdateTag(tag)
	if err != nil {
		return nil, appErr.NewInternal("Failed to update tag", err)
	}

	res := toTagResponse(*updatedTag)
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

func toTagDetailResponse(tag models.Tags, latestReading *models.TagReadings) TagDetailResponse {
	return TagDetailResponse{
		TagResponse:   toTagResponse(tag),
		LatestReading: toLatestTagReadingResponse(latestReading),
	}
}

func toTagResponses(tags []models.Tags) []TagResponse {
	res := make([]TagResponse, 0, len(tags))
	for _, tag := range tags {
		res = append(res, toTagResponse(tag))
	}

	return res
}

func toLatestTagReadingResponse(reading *models.TagReadings) *LatestTagReadingResponse {
	if reading == nil {
		return nil
	}

	return &LatestTagReadingResponse{
		ID:           reading.ID,
		TagID:        reading.TagID.String(),
		ValueNumeric: reading.ValueNumeric,
		ValueText:    reading.ValueText,
		ValueBool:    reading.ValueBool,
		Quality:      reading.Quality,
		Source:       reading.Source,
		RecordedAt:   reading.RecordedAt,
	}
}

func isValidTagDataType(dataType models.TagDataType) bool {
	return dataType == models.BoolDataType ||
		dataType == models.IntDataType ||
		dataType == models.FloatDataType ||
		dataType == models.StringDataType
}
