package valve

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

func (h *Handler) UpdateValveSettings(c *gin.Context) {
	plantId := c.Param("id")
	valveId := c.Param("valveId")

	req, err := http_helper.BindJSON[UpdateValveRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	if err := h.service.UpdateValveSettings(*req, plantId, valveId); err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{
		"message": "Valve updated successfully",
	})
}
