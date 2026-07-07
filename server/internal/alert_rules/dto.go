package alert_rules

import (
	"smart-plc-control-server/internal/models"
	"time"
)

type CreateAlertRuleRequest struct {
	TagID            string               `json:"tagId" binding:"required"`
	Name             string               `json:"name" binding:"required,min=1,max=120"`
	Operator         models.AlertOperator `json:"operator" binding:"required,oneof=GT GTE LT LTE EQ NEQ"`
	ThresholdNumeric *float64             `json:"thresholdNumeric" binding:"omitempty"`
	ThresholdText    string               `json:"thresholdText" binding:"omitempty"`
	ThresholdBool    *bool                `json:"thresholdBool" binding:"omitempty"`
	Severity         models.AlertSeverity `json:"severity" binding:"required,oneof=LOW MEDIUM HIGH CRITICAL"`
	DelaySeconds     int                  `json:"delaySeconds" binding:"omitempty,min=0"`
	Message          string               `json:"message" binding:"omitempty"`
	Enabled          *bool                `json:"enabled" binding:"omitempty"`
}

type UpdateAlertRuleRequest struct {
	TagID            string               `json:"tagId" binding:"omitempty"`
	Name             string               `json:"name" binding:"omitempty,min=1,max=120"`
	Operator         models.AlertOperator `json:"operator" binding:"omitempty,oneof=GT GTE LT LTE EQ NEQ"`
	ThresholdNumeric *float64             `json:"thresholdNumeric" binding:"omitempty"`
	ThresholdText    string               `json:"thresholdText" binding:"omitempty"`
	ThresholdBool    *bool                `json:"thresholdBool" binding:"omitempty"`
	Severity         models.AlertSeverity `json:"severity" binding:"omitempty,oneof=LOW MEDIUM HIGH CRITICAL"`
	DelaySeconds     *int                 `json:"delaySeconds" binding:"omitempty,min=0"`
	Message          string               `json:"message" binding:"omitempty"`
	Enabled          *bool                `json:"enabled" binding:"omitempty"`
}

type AlertRuleResponse struct {
	ID               string               `json:"id"`
	TagID            string               `json:"tagId"`
	Name             string               `json:"name"`
	Operator         models.AlertOperator `json:"operator"`
	ThresholdNumeric *float64             `json:"thresholdNumeric"`
	ThresholdText    string               `json:"thresholdText"`
	ThresholdBool    *bool                `json:"thresholdBool"`
	Severity         models.AlertSeverity `json:"severity"`
	DelaySeconds     int                  `json:"delaySeconds"`
	Message          string               `json:"message"`
	Enabled          bool                 `json:"enabled"`
	CreatedAt        time.Time            `json:"createdAt"`
	UpdatedAt        time.Time            `json:"updatedAt"`
}
