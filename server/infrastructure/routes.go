package infrastructure

import (
	"plc-dashboard/internal/handler"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	r.GET("/", func (c *gin.Context) {
		c.JSON(200, gin.H {"message": "🌊 PLC-Simulator Server"})
	})

	r.GET("ws/plc", handler.SensorStream)
}