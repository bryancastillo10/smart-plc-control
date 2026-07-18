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
