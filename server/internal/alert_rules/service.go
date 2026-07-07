package alert_rules

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

func (s *Service) CreateAlertRule(req CreateAlertRuleRequest) (*AlertRuleResponse, error) {
	if req.TagID == "" || req.Name == "" || req.Operator == "" || req.Severity == "" {
		return nil, appErr.NewBadRequest("Missing required fields", nil)
	}

	if !isValidAlertOperator(req.Operator) {
		return nil, appErr.NewBadRequest("Invalid alert operator", nil)
	}
	if !isValidAlertSeverity(req.Severity) {
		return nil, appErr.NewBadRequest("Invalid alert severity", nil)
	}
	if req.DelaySeconds < 0 {
		return nil, appErr.NewBadRequest("Invalid alert delay", nil)
	}

	parsedTagID, err := utils.ParseId(req.TagID)
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

	if err := validateThresholdForTag(*tag, req); err != nil {
		return nil, err
	}

	enabled := true
	if req.Enabled != nil {
		enabled = *req.Enabled
	}

	alertRule := &models.AlertRules{
		ID:               utils.GenerateUUID(),
		TagID:            parsedTagID,
		Name:             req.Name,
		Operator:         req.Operator,
		ThresholdNumeric: req.ThresholdNumeric,
		ThresholdText:    req.ThresholdText,
		ThresholdBool:    req.ThresholdBool,
		Severity:         req.Severity,
		DelaySeconds:     req.DelaySeconds,
		Message:          req.Message,
		Enabled:          enabled,
	}

	createdAlertRule, err := s.repo.CreateAlertRule(alertRule)
	if err != nil {
		return nil, appErr.NewInternal("Failed to create alert rule", err)
	}

	res := toAlertRuleResponse(*createdAlertRule)
	return &res, nil
}

func validateThresholdForTag(tag models.Tags, req CreateAlertRuleRequest) error {
	thresholdCount := 0
	if req.ThresholdNumeric != nil {
		thresholdCount++
	}
	if req.ThresholdText != "" {
		thresholdCount++
	}
	if req.ThresholdBool != nil {
		thresholdCount++
	}

	if thresholdCount == 0 {
		return appErr.NewBadRequest("Missing alert threshold", nil)
	}
	if thresholdCount > 1 {
		return appErr.NewBadRequest("Only one alert threshold can be set", nil)
	}

	switch tag.DataType {
	case models.BoolDataType:
		if req.ThresholdBool == nil {
			return appErr.NewBadRequest("BOOL tags require thresholdBool", nil)
		}
		if req.Operator != models.EqualTo && req.Operator != models.NotEqualTo {
			return appErr.NewBadRequest("BOOL alert rules only support EQ or NEQ operators", nil)
		}
	case models.StringDataType:
		if req.ThresholdText == "" {
			return appErr.NewBadRequest("STRING tags require thresholdText", nil)
		}
		if req.Operator != models.EqualTo && req.Operator != models.NotEqualTo {
			return appErr.NewBadRequest("STRING alert rules only support EQ or NEQ operators", nil)
		}
	case models.IntDataType, models.FloatDataType:
		if req.ThresholdNumeric == nil {
			return appErr.NewBadRequest("Numeric tags require thresholdNumeric", nil)
		}
	default:
		return appErr.NewBadRequest("Unsupported tag data type", nil)
	}

	return nil
}

func toAlertRuleResponse(alertRule models.AlertRules) AlertRuleResponse {
	return AlertRuleResponse{
		ID:               alertRule.ID.String(),
		TagID:            alertRule.TagID.String(),
		Name:             alertRule.Name,
		Operator:         alertRule.Operator,
		ThresholdNumeric: alertRule.ThresholdNumeric,
		ThresholdText:    alertRule.ThresholdText,
		ThresholdBool:    alertRule.ThresholdBool,
		Severity:         alertRule.Severity,
		DelaySeconds:     alertRule.DelaySeconds,
		Message:          alertRule.Message,
		Enabled:          alertRule.Enabled,
		CreatedAt:        alertRule.CreatedAt,
		UpdatedAt:        alertRule.UpdatedAt,
	}
}

func isValidAlertOperator(operator models.AlertOperator) bool {
	return operator == models.GreaterThan ||
		operator == models.GreaterThanOrEqualTo ||
		operator == models.LessThan ||
		operator == models.LessThanOrEqualTo ||
		operator == models.EqualTo ||
		operator == models.NotEqualTo
}

func isValidAlertSeverity(severity models.AlertSeverity) bool {
	return severity == models.LowSeverity ||
		severity == models.MediumSeverity ||
		severity == models.HighSeverity ||
		severity == models.CriticalSeverity
}
