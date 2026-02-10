package plant

import (
	appErr "plc-dashboard/pkg/errors"
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

func (h *Handler) CreatePlant(c *gin.Context) {
	req, err := http_helper.BindJSON[CreatePlantRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	adminId, err := http_helper.ExtractUserIDFromContext(c)
	if err != nil {
		c.Error(err)
		return
	}

	newPlant, err := h.service.CreatePlant(*req, adminId)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{
		"message": "A Treatment Plant has been created successfully",
		"plant":   newPlant,
	})
}

func (h *Handler) GetAllPlants(c *gin.Context) {
	plants, err := h.service.GetAllPlants()
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{
		"plants": plants,
	})
}

func (h *Handler) GetPlantByID(c *gin.Context) {
	plantId := c.Param("id")

	plant, err := h.service.GetPlantByID(plantId)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, plant)
}

func (h *Handler) DeletePlant(c *gin.Context) {
	plantID := c.Param("id")
	confirm := c.Query("confirm")

	if confirm != "delete" {
		c.Error(
			appErr.NewBadRequest(
				"Deletion not confirmed. Please type 'delete' to confirm this action.",
				nil,
			),
		)
		return
	}

	if err := h.service.DeletePlant(plantID); err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{
		"message": "The treatment plant has been deleted successfully",
	})
}
