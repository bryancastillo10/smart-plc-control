package bootstrap

import (
	"smart-plc-control-server/internal/auth"
	"smart-plc-control-server/platforms/database"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api/v1")

	authRepo := auth.NewRepository(database.DB)
	authService := auth.NewService(authRepo)
	authHandler := auth.NewHandler(authService)
	authHandler.RegisterRoutes(api)
}
