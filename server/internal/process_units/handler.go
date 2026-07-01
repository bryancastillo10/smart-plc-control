package process_units

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

func (h *Handler) CreateProcessUnit(c *gin.Context) {
	plantID := c.Param("plantId")

	req, err := http.BindJSON[CreateProcessUnitRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	processUnit, err := h.service.CreateProcessUnit(plantID, *req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(201, processUnit)
}
