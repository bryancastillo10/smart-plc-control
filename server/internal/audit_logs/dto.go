package audit_logs

import "time"

type ListAuditLogsQuery struct {
	UserID     string `form:"userId" binding:"omitempty"`
	Action     string `form:"action" binding:"omitempty,max=50"`
	EntityType string `form:"entityType" binding:"omitempty,max=50"`
	EntityID   string `form:"entityId" binding:"omitempty"`
	From       string `form:"from" binding:"omitempty"`
	To         string `form:"to" binding:"omitempty"`
	Limit      int    `form:"limit" binding:"omitempty,min=1,max=500"`
}

type AuditLogUserResponse struct {
	ID       string `json:"id"`
	UserName string `json:"username"`
	Email    string `json:"email"`
}

type AuditLogResponse struct {
	ID         uint64                 `json:"id"`
	UserID     *string                `json:"userId"`
	User       *AuditLogUserResponse  `json:"user"`
	Action     string                 `json:"action"`
	EntityType string                 `json:"entityType"`
	EntityID   *string                `json:"entityId"`
	Details    map[string]interface{} `json:"details"`
	CreatedAt  time.Time              `json:"createdAt"`
}
