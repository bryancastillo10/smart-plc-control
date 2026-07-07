package alerts

import (
	"smart-plc-control-server/internal/models"
	appErr "smart-plc-control-server/pkg/errors"
	"smart-plc-control-server/pkg/utils"
	"time"
)

type Service struct {
	repo *Repository
}

func NewService(repo *Repository) *Service {
	return &Service{repo: repo}
}

func (s *Service) GetAlerts(query ListAlertsQuery) ([]AlertResponse, error) {
	filters := AlertFilters{}

	if query.Status != "" {
		if !isValidAlertStatus(query.Status) {
			return nil, appErr.NewBadRequest("Invalid alert status", nil)
		}
		filters.Status = &query.Status
	}

	if query.Severity != "" {
		if !isValidAlertSeverity(query.Severity) {
			return nil, appErr.NewBadRequest("Invalid alert severity", nil)
		}
		filters.Severity = &query.Severity
	}

	if query.AlertRuleID != "" {
		parsedRuleID, err := utils.ParseId(query.AlertRuleID)
		if err != nil {
			return nil, appErr.NewBadRequest("Invalid alert rule ID", err)
		}

		alertRule, err := s.repo.FindAlertRuleByID(parsedRuleID)
		if err != nil {
			return nil, appErr.NewInternal("Failed to find alert rule", err)
		}
		if alertRule == nil {
			return nil, appErr.NewNotFound("Alert rule not found", nil)
		}

		filters.AlertRuleID = &parsedRuleID
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

	alerts, err := s.repo.FindAlerts(filters)
	if err != nil {
		return nil, appErr.NewInternal("Failed to get alerts", err)
	}

	return toAlertResponses(alerts), nil
}

func parseTimestamp(value string, field string) (time.Time, error) {
	parsed, err := time.Parse(time.RFC3339, value)
	if err != nil {
		return time.Time{}, appErr.NewBadRequest("Invalid "+field+" timestamp", err)
	}

	return parsed, nil
}

func toAlertResponses(alerts []models.Alerts) []AlertResponse {
	res := make([]AlertResponse, 0, len(alerts))
	for _, alert := range alerts {
		res = append(res, toAlertResponse(alert))
	}

	return res
}

func toAlertResponse(alert models.Alerts) AlertResponse {
	var acknowledgedBy *string
	if alert.AcknowledgedBy != nil {
		id := alert.AcknowledgedBy.String()
		acknowledgedBy = &id
	}

	var severity *models.AlertSeverity
	alertRuleName := ""
	if alert.AlertRule != nil {
		severity = &alert.AlertRule.Severity
		alertRuleName = alert.AlertRule.Name
	}

	return AlertResponse{
		ID:             alert.ID.String(),
		AlertRuleID:    alert.AlertRuleID.String(),
		AlertRuleName:  alertRuleName,
		Severity:       severity,
		TriggerValue:   alert.TriggerValue,
		Status:         alert.Status,
		Message:        alert.Message,
		TriggeredAt:    alert.TriggeredAt,
		AcknowledgedAt: alert.AcknowledgedAt,
		AcknowledgedBy: acknowledgedBy,
		ResolvedAt:     alert.ResolvedAt,
	}
}

func isValidAlertStatus(status models.AlertStatus) bool {
	return status == models.AlertActive ||
		status == models.AlertAcknowledged ||
		status == models.AlertResolved
}

func isValidAlertSeverity(severity models.AlertSeverity) bool {
	return severity == models.LowSeverity ||
		severity == models.MediumSeverity ||
		severity == models.HighSeverity ||
		severity == models.CriticalSeverity
}
