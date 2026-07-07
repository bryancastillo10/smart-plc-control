package alert_rules

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

func (h *Handler) CreateAlertRule(c *gin.Context) {
	req, err := http.BindJSON[CreateAlertRuleRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	alertRule, err := h.service.CreateAlertRule(*req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(201, alertRule)
}
