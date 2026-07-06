package tag_readings

import (
	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
	"smart-plc-control-server/pkg/utils"
	"strings"

	"github.com/google/uuid"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetLatestReadings(query LatestReadingsQuery) ([]LatestReadingResponse, error) {
	filters := LatestReadingFilters{}

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

		filters.ProcessUnitID = &parsedProcessUnitID
	}

	if query.TagIDs != "" {
		tagIDs, err := parseTagIDs(query.TagIDs)
		if err != nil {
			return nil, err
		}

		tags, err := s.repo.FindTagsByIDs(tagIDs)
		if err != nil {
			return nil, appErr.NewInternal("Failed to find tags", err)
		}
		if len(tags) != len(tagIDs) {
			return nil, appErr.NewNotFound("One or more tags were not found", nil)
		}

		if filters.DeviceID != nil || filters.ProcessUnitID != nil {
			for _, tag := range tags {
				if filters.DeviceID != nil && tag.DeviceID != *filters.DeviceID {
					return nil, appErr.NewBadRequest("Tag must belong to the filtered device", nil)
				}
				if filters.ProcessUnitID != nil && (tag.ProcessUnitID == nil || *tag.ProcessUnitID != *filters.ProcessUnitID) {
					return nil, appErr.NewBadRequest("Tag must belong to the filtered process unit", nil)
				}
			}
		}

		filters.TagIDs = tagIDs
	}

	readings, err := s.repo.FindLatestReadings(filters)
	if err != nil {
		return nil, appErr.NewInternal("Failed to get latest readings", err)
	}

	return toLatestReadingResponses(readings), nil
}

func parseTagIDs(value string) ([]uuid.UUID, error) {
	parts := strings.Split(value, ",")
	tagIDs := make([]uuid.UUID, 0, len(parts))
	seen := make(map[uuid.UUID]struct{}, len(parts))

	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part == "" {
			return nil, appErr.NewBadRequest("Invalid tag IDs", nil)
		}

		tagID, err := utils.ParseId(part)
		if err != nil {
			return nil, appErr.NewBadRequest("Invalid tag ID", err)
		}
		if _, ok := seen[tagID]; ok {
			continue
		}

		seen[tagID] = struct{}{}
		tagIDs = append(tagIDs, tagID)
	}

	return tagIDs, nil
}

func toLatestReadingResponses(readings []models.TagReadings) []LatestReadingResponse {
	res := make([]LatestReadingResponse, 0, len(readings))
	for _, reading := range readings {
		res = append(res, LatestReadingResponse{
			ID:           reading.ID,
			TagID:        reading.TagID.String(),
			ValueNumeric: reading.ValueNumeric,
			ValueText:    reading.ValueText,
			ValueBool:    reading.ValueBool,
			Quality:      reading.Quality,
			Source:       reading.Source,
			RecordedAt:   reading.RecordedAt,
		})
	}

	return res
}
