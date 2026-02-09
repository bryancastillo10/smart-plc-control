package auth

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterAuthRoutes(r *gin.Engine, DB *gorm.DB) {
	authHandler := NewHandler(DB)

	authGrp := r.Group("/api/auth")
	{
		authGrp.POST("/signup", authHandler.SignUp)
		authGrp.POST("/signin", authHandler.SignIn)
		authGrp.POST("/signout", authHandler.SignOut)
	}
}
