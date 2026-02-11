package plantsettings

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

func (h *Handler) UpdatePlantSettings(c *gin.Context) {
	plantId := c.Param("id")
	req, err := http_helper.BindJSON[UpdatePlantSettingsRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	userId, err := http_helper.ExtractUserIDFromContext(c)
	if err != nil {
		c.Error(err)
		return
	}

	if err := h.service.UpdatePlantSettings(*req, plantId, userId); err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{
		"message": "Plant settings had been successfully updated",
	})
}
