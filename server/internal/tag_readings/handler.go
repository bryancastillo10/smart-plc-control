package tag_readings

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

func (h *Handler) GetLatestReadings(c *gin.Context) {
	query, err := http.BindQuery[LatestReadingsQuery](c)
	if err != nil {
		c.Error(err)
		return
	}

	readings, err := h.service.GetLatestReadings(*query)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, readings)
}
