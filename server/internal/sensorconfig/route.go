package sensorconfig

import (
	"plc-dashboard/middleware"
	"plc-dashboard/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterSensorConfigRoutes(r *gin.Engine, DB *gorm.DB) {
	sensorConfigHandler := NewHandler(DB)

	sensorGrp := r.Group("/api/plants", middleware.JWTAuthMiddleware())
	{
		sensorGrp.GET("/:id/sensor-configs", sensorConfigHandler.ListSensorConfigs)
		sensorGrp.GET("/:id/sensor-configs/:configId", sensorConfigHandler.GetSensorConfigByID)
		sensorGrp.POST("/:id/sensor-configs", middleware.RequireRoles(models.Admin, models.Operator), sensorConfigHandler.CreateSensorConfig)
		sensorGrp.PATCH("/:id/sensor-configs/:configId", middleware.RequireRoles(models.Admin, models.Operator), sensorConfigHandler.UpdateSensorConfig)
		sensorGrp.DELETE("/:id/sensor-configs/:configId", middleware.RequireRoles(models.Admin), sensorConfigHandler.DeleteSensorConfig)
	}
}
