package audit_logs

import (
	"smart-plc-control-server/pkg/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct {
	service *Service
}

func NewHandler(db *gorm.DB) *Handler {
	repo := NewRepository(db)
	service := NewService(repo)
	return &Handler{service: service}
}

func (h *Handler) GetAuditLogs(c *gin.Context) {
	query, err := http.BindQuery[ListAuditLogsQuery](c)
	if err != nil {
		c.Error(err)
		return
	}

	auditLogs, err := h.service.GetAuditLogs(*query)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, auditLogs)
}
