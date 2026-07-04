package tags

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

func (h *Handler) GetTagsByDeviceID(c *gin.Context) {
	deviceID := c.Param("deviceId")

	tags, err := h.service.GetTagsByDeviceID(deviceID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, tags)
}

func (h *Handler) CreateTag(c *gin.Context) {
	deviceID := c.Param("deviceId")

	req, err := http.BindJSON[CreateTagRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	tag, err := h.service.CreateTag(deviceID, *req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(201, tag)
}
