package sensorconfig

import (
	http_helper "plc-dashboard/pkg/http"

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

func (h *Handler) CreateSensorConfig(c *gin.Context) {
	plantID := c.Param("id")

	req, err := http_helper.BindJSON[CreateSensorConfigRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	config, err := h.service.CreateSensorConfig(*req, plantID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(201, gin.H{
		"message":      "Sensor config created successfully",
		"sensorConfig": config,
	})
}

func (h *Handler) ListSensorConfigs(c *gin.Context) {
	plantID := c.Param("id")

	configs, err := h.service.ListSensorConfigs(plantID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{
		"sensorConfigs": configs,
	})
}

func (h *Handler) GetSensorConfigByID(c *gin.Context) {
	plantID := c.Param("id")
	configID := c.Param("configId")

	config, err := h.service.GetSensorConfig(plantID, configID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{
		"sensorConfig": config,
	})
}

func (h *Handler) UpdateSensorConfig(c *gin.Context) {
	plantID := c.Param("id")
	configID := c.Param("configId")

	req, err := http_helper.BindJSON[UpdateSensorConfigRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	config, err := h.service.UpdateSensorConfig(*req, plantID, configID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{
		"message":      "Sensor config updated successfully",
		"sensorConfig": config,
	})
}

func (h *Handler) DeleteSensorConfig(c *gin.Context) {
	plantID := c.Param("id")
	configID := c.Param("configId")

	if err := h.service.DeleteSensorConfig(plantID, configID); err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{
		"message": "Sensor config deleted successfully",
	})
}
