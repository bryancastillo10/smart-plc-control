package infrastructure

import (
	"plc-dashboard/internal/auth"
	"plc-dashboard/internal/plant"
	"plc-dashboard/internal/plantsettings"
	"plc-dashboard/internal/sensorconfig"
	"plc-dashboard/internal/user"
	"plc-dashboard/internal/valve"

	"plc-dashboard/internal/simulator"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "🌊 PLC-Simulator Server"})
	})

	auth.RegisterAuthRoutes(r, DB)
	user.RegisterUserRoutes(r, DB)
	plant.RegisterPlantRoutes(r, DB)
	plantsettings.RegisterPlantSettingsRoutes(r, DB)
	valve.RegisterValveRoutes(r, DB)
	sensorconfig.RegisterSensorConfigRoutes(r, DB)

	r.GET("ws/plc", simulator.SensorStream)
}
