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

func (s *Service) GetAlertRules() ([]AlertRuleResponse, error) {
	alertRules, err := s.repo.FindAlertRules()
	if err != nil {
		return nil, appErr.NewInternal("Failed to get alert rules", err)
	}

	return toAlertRuleResponses(alertRules), nil
}

func (s *Service) GetAlertRuleByID(ruleID string) (*AlertRuleResponse, error) {
	if ruleID == "" {
		return nil, appErr.NewBadRequest("Missing alert rule ID", nil)
	}

	parsedRuleID, err := utils.ParseId(ruleID)
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

	res := toAlertRuleResponse(*alertRule)
	return &res, nil
}

func (s *Service) UpdateAlertRule(ruleID string, req UpdateAlertRuleRequest) (*AlertRuleResponse, error) {
	if ruleID == "" {
		return nil, appErr.NewBadRequest("Missing alert rule ID", nil)
	}

	if req.TagID == "" && req.Name == "" && req.Operator == "" && req.ThresholdNumeric == nil && req.ThresholdText == "" && req.ThresholdBool == nil && req.Severity == "" && req.DelaySeconds == nil && req.Message == "" && req.Enabled == nil {
		return nil, appErr.NewBadRequest("Missing alert rule fields to update", nil)
	}

	if req.Operator != "" && !isValidAlertOperator(req.Operator) {
		return nil, appErr.NewBadRequest("Invalid alert operator", nil)
	}
	if req.Severity != "" && !isValidAlertSeverity(req.Severity) {
		return nil, appErr.NewBadRequest("Invalid alert severity", nil)
	}
	if req.DelaySeconds != nil && *req.DelaySeconds < 0 {
		return nil, appErr.NewBadRequest("Invalid alert delay", nil)
	}

	parsedRuleID, err := utils.ParseId(ruleID)
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

	tagID := alertRule.TagID
	if req.TagID != "" {
		parsedTagID, err := utils.ParseId(req.TagID)
		if err != nil {
			return nil, appErr.NewBadRequest("Invalid tag ID", err)
		}
		tagID = parsedTagID
		alertRule.TagID = parsedTagID
	}

	tag, err := s.repo.FindTagByID(tagID)
	if err != nil {
		return nil, appErr.NewInternal("Failed to find tag", err)
	}
	if tag == nil {
		return nil, appErr.NewNotFound("Tag not found", nil)
	}

	thresholdUpdates := 0
	if req.ThresholdNumeric != nil {
		thresholdUpdates++
	}
	if req.ThresholdText != "" {
		thresholdUpdates++
	}
	if req.ThresholdBool != nil {
		thresholdUpdates++
	}
	if thresholdUpdates > 1 {
		return nil, appErr.NewBadRequest("Only one alert threshold can be set", nil)
	}

	utils.PatchIfNotZero(&alertRule.Name, req.Name)
	utils.PatchIfNotZero(&alertRule.Operator, req.Operator)
	utils.PatchIfNotZero(&alertRule.Severity, req.Severity)
	utils.PatchIfNotZero(&alertRule.Message, req.Message)
	if req.DelaySeconds != nil {
		alertRule.DelaySeconds = *req.DelaySeconds
	}
	if req.Enabled != nil {
		alertRule.Enabled = *req.Enabled
	}

	if req.ThresholdNumeric != nil {
		alertRule.ThresholdNumeric = req.ThresholdNumeric
		alertRule.ThresholdText = ""
		alertRule.ThresholdBool = nil
	}
	if req.ThresholdText != "" {
		alertRule.ThresholdNumeric = nil
		alertRule.ThresholdText = req.ThresholdText
		alertRule.ThresholdBool = nil
	}
	if req.ThresholdBool != nil {
		alertRule.ThresholdNumeric = nil
		alertRule.ThresholdText = ""
		alertRule.ThresholdBool = req.ThresholdBool
	}

	if err := validateAlertRuleForTag(*tag, *alertRule); err != nil {
		return nil, err
	}

	updatedAlertRule, err := s.repo.UpdateAlertRule(alertRule)
	if err != nil {
		return nil, appErr.NewInternal("Failed to update alert rule", err)
	}

	res := toAlertRuleResponse(*updatedAlertRule)
	return &res, nil
}

func (s *Service) DeleteAlertRule(ruleID string) error {
	if ruleID == "" {
		return appErr.NewBadRequest("Missing alert rule ID", nil)
	}

	parsedRuleID, err := utils.ParseId(ruleID)
	if err != nil {
		return appErr.NewBadRequest("Invalid alert rule ID", err)
	}

	alertRule, err := s.repo.FindAlertRuleByID(parsedRuleID)
	if err != nil {
		return appErr.NewInternal("Failed to find alert rule", err)
	}
	if alertRule == nil {
		return appErr.NewNotFound("Alert rule not found", nil)
	}

	if err := s.repo.DeleteAlertRule(alertRule); err != nil {
		return appErr.NewInternal("Failed to delete alert rule", err)
	}

	return nil
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

func validateAlertRuleForTag(tag models.Tags, alertRule models.AlertRules) error {
	thresholdCount := 0
	if alertRule.ThresholdNumeric != nil {
		thresholdCount++
	}
	if alertRule.ThresholdText != "" {
		thresholdCount++
	}
	if alertRule.ThresholdBool != nil {
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
		if alertRule.ThresholdBool == nil {
			return appErr.NewBadRequest("BOOL tags require thresholdBool", nil)
		}
		if alertRule.Operator != models.EqualTo && alertRule.Operator != models.NotEqualTo {
			return appErr.NewBadRequest("BOOL alert rules only support EQ or NEQ operators", nil)
		}
	case models.StringDataType:
		if alertRule.ThresholdText == "" {
			return appErr.NewBadRequest("STRING tags require thresholdText", nil)
		}
		if alertRule.Operator != models.EqualTo && alertRule.Operator != models.NotEqualTo {
			return appErr.NewBadRequest("STRING alert rules only support EQ or NEQ operators", nil)
		}
	case models.IntDataType, models.FloatDataType:
		if alertRule.ThresholdNumeric == nil {
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

func toAlertRuleResponses(alertRules []models.AlertRules) []AlertRuleResponse {
	res := make([]AlertRuleResponse, 0, len(alertRules))
	for _, alertRule := range alertRules {
		res = append(res, toAlertRuleResponse(alertRule))
	}

	return res
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
