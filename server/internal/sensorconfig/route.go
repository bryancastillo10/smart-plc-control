package sensorconfig

import (
	"plc-dashboard/middleware"
	"plc-dashboard/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterSensorConfigRoutes(r *gin.Engine, DB *gorm.DB) {
	// sensorConfigHandler := NewHandler(DB)

	sensorGrp := r.Group("/api/plants", middleware.JWTAuthMiddleware())
	{
		sensorGrp.GET("/:id/sensor-configs")
		sensorGrp.GET("/:id/sensor-configs/:configId")
		sensorGrp.POST("/:id/sensor-configs", middleware.RequireRoles(models.Admin, models.Operator))
		sensorGrp.PATCH("/:id/sensor-configs/:configId", middleware.RequireRoles(models.Admin, models.Operator))
		sensorGrp.DELETE("/:id/sensor-configs/:configId", middleware.RequireRoles(models.Admin))
	}
}
