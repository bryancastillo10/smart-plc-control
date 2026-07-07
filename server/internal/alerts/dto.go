package alerts

import (
	"smart-plc-control-server/internal/models"
	"time"
)

type ListAlertsQuery struct {
	Status      models.AlertStatus   `form:"status" binding:"omitempty,oneof=ACTIVE ACKNOWLEDGED RESOLVED"`
	Severity    models.AlertSeverity `form:"severity" binding:"omitempty,oneof=LOW MEDIUM HIGH CRITICAL"`
	PlantID     string               `form:"plantId" binding:"omitempty"`
	AlertRuleID string               `form:"alertRuleId" binding:"omitempty"`
	From        string               `form:"from" binding:"omitempty"`
	To          string               `form:"to" binding:"omitempty"`
}

type AlertResponse struct {
	ID             string                `json:"id"`
	AlertRuleID    string                `json:"alertRuleId"`
	AlertRuleName  string                `json:"alertRuleName"`
	Severity       *models.AlertSeverity `json:"severity"`
	TriggerValue   string                `json:"triggerValue"`
	Status         models.AlertStatus    `json:"status"`
	Message        string                `json:"message"`
	TriggeredAt    time.Time             `json:"triggeredAt"`
	AcknowledgedAt *time.Time            `json:"acknowledgedAt"`
	AcknowledgedBy *string               `json:"acknowledgedBy"`
	ResolvedAt     *time.Time            `json:"resolvedAt"`
}
