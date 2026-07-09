package audit_logs

import (
	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
	"smart-plc-control-server/pkg/utils"
	"strconv"
	"time"
)

const defaultAuditLogLimit = 100

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAuditLogs(query ListAuditLogsQuery) ([]AuditLogResponse, error) {
	filters := AuditLogFilters{Limit: defaultAuditLogLimit}

	if query.Limit > 0 {
		filters.Limit = query.Limit
	}

	if query.UserID != "" {
		parsedUserID, err := utils.ParseId(query.UserID)
		if err != nil {
			return nil, appErr.NewBadRequest("Invalid user ID", err)
		}

		user, err := s.repo.FindUserByID(parsedUserID)
		if err != nil {
			return nil, appErr.NewInternal("Failed to find user", err)
		}
		if user == nil {
			return nil, appErr.NewNotFound("User not found", nil)
		}

		filters.UserID = &parsedUserID
	}

	if query.EntityID != "" {
		parsedEntityID, err := utils.ParseId(query.EntityID)
		if err != nil {
			return nil, appErr.NewBadRequest("Invalid entity ID", err)
		}

		filters.EntityID = &parsedEntityID
	}

	if query.From != "" {
		from, err := parseTimestamp(query.From, "from")
		if err != nil {
			return nil, err
		}
		filters.From = &from
	}
	if query.To != "" {
		to, err := parseTimestamp(query.To, "to")
		if err != nil {
			return nil, err
		}
		filters.To = &to
	}
	if filters.From != nil && filters.To != nil && !filters.From.Before(*filters.To) {
		return nil, appErr.NewBadRequest("from must be before to", nil)
	}

	filters.Action = query.Action
	filters.EntityType = query.EntityType

	auditLogs, err := s.repo.FindAuditLogs(filters)
	if err != nil {
		return nil, appErr.NewInternal("Failed to get audit logs", err)
	}

	return toAuditLogResponses(auditLogs), nil
}

func (s *Service) GetAuditLogByID(auditLogID string) (*AuditLogResponse, error) {
	if auditLogID == "" {
		return nil, appErr.NewBadRequest("Missing audit log ID", nil)
	}

	parsedAuditLogID, err := strconv.ParseUint(auditLogID, 10, 64)
	if err != nil || parsedAuditLogID == 0 {
		return nil, appErr.NewBadRequest("Invalid audit log ID", err)
	}

	auditLog, err := s.repo.FindAuditLogByID(parsedAuditLogID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find audit log", err)
	}
	if auditLog == nil {
		return nil, appErr.NewNotFound("Audit log not found", nil)
	}

	res := toAuditLogResponse(*auditLog)
	return &res, nil
}

func parseTimestamp(value string, field string) (time.Time, error) {
	parsed, err := time.Parse(time.RFC3339, value)
	if err != nil {
		return time.Time{}, appErr.NewBadRequest("Invalid "+field+" timestamp", err)
	}

	return parsed, nil
}

func toAuditLogResponses(auditLogs []models.AuditLogs) []AuditLogResponse {
	res := make([]AuditLogResponse, 0, len(auditLogs))
	for _, auditLog := range auditLogs {
		res = append(res, toAuditLogResponse(auditLog))
	}

	return res
}

func toAuditLogResponse(auditLog models.AuditLogs) AuditLogResponse {
	var userID *string
	if auditLog.UserID != nil {
		id := auditLog.UserID.String()
		userID = &id
	}

	var user *AuditLogUserResponse
	if auditLog.User != nil {
		user = &AuditLogUserResponse{
			ID:       auditLog.User.ID.String(),
			UserName: auditLog.User.UserName,
			Email:    auditLog.User.Email,
		}
	}

	var entityID *string
	if auditLog.EntityID != nil {
		id := auditLog.EntityID.String()
		entityID = &id
	}

	return AuditLogResponse{
		ID:         auditLog.ID,
		UserID:     userID,
		User:       user,
		Action:     auditLog.Action,
		EntityType: auditLog.EntityType,
		EntityID:   entityID,
		Details:    auditLog.Details,
		CreatedAt:  auditLog.CreatedAt,
	}
}
