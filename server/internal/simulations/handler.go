package simulations

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

func (h *Handler) CreateSimulation(c *gin.Context) {
	req, err := http.BindJSON[CreateSimulationRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	simulation, err := h.service.CreateSimulation(*req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(201, simulation)
}
