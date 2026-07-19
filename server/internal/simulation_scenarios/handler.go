package simulation_scenarios

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

func (h *Handler) GetSimulationScenarios(c *gin.Context) {
	scenarios, err := h.service.GetSimulationScenarios()
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, scenarios)
}

func (h *Handler) GetSimulationScenarioByID(c *gin.Context) {
	scenarioID := c.Param("scenarioId")

	scenario, err := h.service.GetSimulationScenarioByID(scenarioID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, scenario)
}

func (h *Handler) UpdateSimulationScenario(c *gin.Context) {
	scenarioID := c.Param("scenarioId")

	req, err := http.BindJSON[UpdateSimulationScenarioRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	scenario, err := h.service.UpdateSimulationScenario(scenarioID, *req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, scenario)
}

func (h *Handler) DeleteSimulationScenario(c *gin.Context) {
	scenarioID := c.Param("scenarioId")

	if err := h.service.DeleteSimulationScenario(scenarioID); err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{"message": "Simulation scenario deleted successfully"})
}

func (h *Handler) TriggerSimulationScenario(c *gin.Context) {
	simulationID := c.Param("simulationId")
	scenarioID := c.Param("scenarioId")

	result, err := h.service.TriggerSimulationScenario(simulationID, scenarioID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, result)
}

func (h *Handler) CreateSimulationScenario(c *gin.Context) {
	simulationID := c.Param("simulationId")

	req, err := http.BindJSON[CreateSimulationScenarioRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	scenario, err := h.service.CreateSimulationScenario(simulationID, *req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(201, scenario)
}
