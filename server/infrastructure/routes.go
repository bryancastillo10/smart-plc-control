package infrastructure

import (
	"plc-dashboard/internal/auth"
	"plc-dashboard/internal/plant"
	"plc-dashboard/internal/plantsettings"
	"plc-dashboard/internal/valve"

	"plc-dashboard/internal/simulator"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "🌊 PLC-Simulator Server"})
	})

	auth.RegisterAuthRoutes(r, DB)
	plant.RegisterPlantRoutes(r, DB)
	plantsettings.RegisterPlantSettingsRoutes(r, DB)
	valve.RegisterValveRoutes(r, DB)

	r.GET("ws/plc", simulator.SensorStream)
}
