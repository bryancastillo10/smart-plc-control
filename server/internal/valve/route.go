package valve

import (
	"plc-dashboard/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterValveRoutes(r *gin.Engine, DB *gorm.DB) {
	valveHandler := NewHandler(DB)

	valveGrp := r.Group("/api/plants", middleware.JWTAuthMiddleware())
	{
		valveGrp.PUT("/:id/valves/:valveId", valveHandler.UpdateValveSettings)
	}
}
