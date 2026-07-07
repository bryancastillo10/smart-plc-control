package alerts

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

func (h *Handler) GetAlerts(c *gin.Context) {
	query, err := http.BindQuery[ListAlertsQuery](c)
	if err != nil {
		c.Error(err)
		return
	}

	alerts, err := h.service.GetAlerts(*query)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, alerts)
}

func (h *Handler) GetAlertByID(c *gin.Context) {
	alertID := c.Param("alertId")

	alert, err := h.service.GetAlertByID(alertID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, alert)
}
