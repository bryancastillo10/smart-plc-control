package plants

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

func (h *Handler) CreatePlant(c *gin.Context) {
	req, err := http.BindJSON[CreatePlantRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	plant, err := h.service.CreatePlant(*req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(201, plant)
}

func (h *Handler) GetAllPlants(c *gin.Context) {
	plants, err := h.service.GetAllPlants()
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, plants)
}

func (h *Handler) GetPlantByID(c *gin.Context) {
	plantID := c.Param("plantId")

	plant, err := h.service.GetPlantByID(plantID)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, plant)
}

func (h *Handler) UpdatePlant(c *gin.Context) {
	plantID := c.Param("plantId")

	req, err := http.BindJSON[UpdatePlantRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	plant, err := h.service.UpdatePlant(plantID, *req)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, plant)
}

func (h *Handler) DeletePlant(c *gin.Context) {
	plantID := c.Param("plantId")

	req, err := http.BindJSON[DeletePlantRequest](c)
	if err != nil {
		c.Error(err)
		return
	}

	if err := h.service.DeletePlant(plantID, *req); err != nil {
		c.Error(err)
		return
	}

	c.JSON(200, gin.H{"message": "Plant deleted successfully"})
}
