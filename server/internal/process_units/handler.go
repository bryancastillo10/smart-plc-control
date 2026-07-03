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

func (h *Handler) GetProcessUnitsByPlantID(c *gin.Context) {
	plantID := c.Param("plantId")

	processUnits, err := h.service.GetProcessUnitsByPlantID(plantID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, processUnits)
}

func (h *Handler) GetProcessUnitByID(c *gin.Context) {
	processUnitID := c.Param("processUnitId")

	processUnit, err := h.service.GetProcessUnitByID(processUnitID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, processUnit)
}

func (h *Handler) UpdateProcessUnit(c *gin.Context) {
	processUnitID := c.Param("processUnitId")

	req, err := http.BindJSON[UpdateProcessUnitRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	processUnit, err := h.service.UpdateProcessUnit(processUnitID, *req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, processUnit)
}

func (h *Handler) DeleteProcessUnit(c *gin.Context) {
	processUnitID := c.Param("processUnitId")

	req, err := http.BindJSON[DeleteProcessUnitRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	processUnit, err := h.service.DeleteProcessUnit(processUnitID, *req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, processUnit)
}

func (h *Handler) CreateProcessUnitConnection(c *gin.Context) {
	plantID := c.Param("plantId")

	req, err := http.BindJSON[CreateProcessUnitConnectionRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	connection, err := h.service.CreateProcessUnitConnection(plantID, *req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(201, connection)
}

func (h *Handler) GetProcessUnitConnectionsByPlantID(c *gin.Context) {
	plantID := c.Param("plantId")

	connections, err := h.service.GetProcessUnitConnectionsByPlantID(plantID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, connections)
}

func (h *Handler) GetProcessUnitConnectionByID(c *gin.Context) {
	connectionID := c.Param("connectionId")

	connection, err := h.service.GetProcessUnitConnectionByID(connectionID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, connection)
}

func (h *Handler) UpdateProcessUnitConnection(c *gin.Context) {
	connectionID := c.Param("connectionId")

	req, err := http.BindJSON[UpdateProcessUnitConnectionRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	connection, err := h.service.UpdateProcessUnitConnection(connectionID, *req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, connection)
}

func (h *Handler) DeleteProcessUnitConnection(c *gin.Context) {
	connectionID := c.Param("connectionId")

	req, err := http.BindJSON[DeleteProcessUnitConnectionRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	if err := h.service.DeleteProcessUnitConnection(connectionID, *req); err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{"message": "Process unit connection deleted successfully"})
}
