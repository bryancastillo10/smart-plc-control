package plant

import (
	"plc-dashboard/middleware"
	"plc-dashboard/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterPlantRoutes(r *gin.Engine, DB *gorm.DB) {
	plantHandler := NewHandler(DB)

	plantGrp := r.Group("/api/plants", middleware.JWTAuthMiddleware())
	{
		plantGrp.POST("/", middleware.RequireRoles(models.Admin), plantHandler.CreatePlant)
		plantGrp.GET("/", plantHandler.GetAllPlants)
		plantGrp.GET("/:id", plantHandler.GetPlantByID)
		plantGrp.DELETE("/:id", middleware.RequireRoles(models.Admin), plantHandler.DeletePlant)
	}
}
