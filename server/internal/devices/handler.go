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
