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

func (h *Handler) GetSimulations(c *gin.Context) {
	query, err := http.BindQuery[ListSimulationsQuery](c)
	if err != nil {
		c.Error(err)
		return
	}

	simulations, err := h.service.GetSimulations(*query)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, simulations)
}

func (h *Handler) GetSimulationByID(c *gin.Context) {
	simulationID := c.Param("simulationId")

	simulation, err := h.service.GetSimulationByID(simulationID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, simulation)
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

func (h *Handler) UpdateSimulation(c *gin.Context) {
	simulationID := c.Param("simulationId")

	req, err := http.BindJSON[UpdateSimulationRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	simulation, err := h.service.UpdateSimulation(simulationID, *req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, simulation)
}

func (h *Handler) StartSimulation(c *gin.Context) {
	simulationID := c.Param("simulationId")

	simulation, err := h.service.StartSimulation(simulationID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, simulation)
}

func (h *Handler) DeleteSimulation(c *gin.Context) {
	simulationID := c.Param("simulationId")

	req, err := http.BindJSON[DeleteSimulationRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	if err := h.service.DeleteSimulation(simulationID, *req); err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{"message": "Simulation deleted successfully"})
}
