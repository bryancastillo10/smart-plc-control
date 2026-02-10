package plantsettings

import (
	"plc-dashboard/middleware"
	"plc-dashboard/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterPlantSettingsRoutes(r *gin.Engine, DB *gorm.DB) {
	plantSettingsHandler := NewHandler(DB)

	plantGrp := r.Group("/api/plants", middleware.JWTAuthMiddleware())
	{
		plantGrp.PUT("/:id/settings", middleware.RequireRoles(models.Admin, models.Operator), plantSettingsHandler.UpdatePlantSettings)
	}
}
