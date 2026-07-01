package devices

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

func (h *Handler) CreateDevice(c *gin.Context) {
	req, err := http.BindJSON[CreateDeviceRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	device, err := h.service.CreateDevice(*req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(201, device)
}

func (h *Handler) GetAllDevices(c *gin.Context) {
	devices, err := h.service.GetAllDevices()
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, devices)
}

func (h *Handler) GetDeviceByID(c *gin.Context) {
	deviceID := c.Param("deviceId")

	device, err := h.service.GetDeviceByID(deviceID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, device)
}

func (h *Handler) UpdateDevice(c *gin.Context) {
	deviceID := c.Param("deviceId")

	req, err := http.BindJSON[UpdateDeviceRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	device, err := h.service.UpdateDevice(deviceID, *req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, device)
}

func (h *Handler) DeleteDevice(c *gin.Context) {
	deviceID := c.Param("deviceId")

	if err := h.service.DeleteDevice(deviceID); err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{"message": "Device deleted successfully"})
}
