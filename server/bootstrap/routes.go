package bootstrap

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"smart-plc-control-server/internal/auth"
)

func RegisterRoutes(r *gin.Engine, DB *gorm.DB) {
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "🔧 Smart PLC Control Server is running"})
	})

	v1 := r.Group("/api/v1")

	// Baseline Feature Routes
	registerAuth(v1, DB)
}

func registerAuth(r *gin.RouterGroup, DB *gorm.DB) {
	auth := auth.NewHandler(DB)

	authGrp := r.Group("/auth")
	{
		// TODO: Restrict registration to ADMIN users after the initial admin/bootstrap flow exists.
		authGrp.POST("/register", auth.SignUp)
		authGrp.POST("/login", auth.LogIn)
		authGrp.POST("/logout")
		authGrp.GET("/me")
	}
}

func registerUser(r *gin.RouterGroup) {

}

func registerPlant(r *gin.RouterGroup) {

}
