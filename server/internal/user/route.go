package user

import (
	"plc-dashboard/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterUserRoutes(r *gin.Engine, DB *gorm.DB) {
	userHandler := NewHandler(DB)

	userGrp := r.Group("/api/users", middleware.JWTAuthMiddleware()) 
	{
		userGrp.GET("/", userHandler.GetUser)
	}
}