package bootstrap

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"smart-plc-control-server/internal/auth"
	"smart-plc-control-server/internal/devices"
	"smart-plc-control-server/internal/middleware"
	"smart-plc-control-server/internal/models"
	"smart-plc-control-server/internal/plants"
	"smart-plc-control-server/internal/process_units"
	"smart-plc-control-server/internal/users"
)

func RegisterRoutes(r *gin.Engine, DB *gorm.DB) {
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "🔧 Smart PLC Control Server is running"})
	})

	v1 := r.Group("/api/v1")

	// Baseline Feature Routes
	registerAuth(v1, DB)
	registerUsers(v1, DB)
	registerPlants(v1, DB)
	registerProcessUnits(v1, DB)
	registerDevices(v1, DB)
	registerTags(v1, DB)
	registerReadings(v1, DB)
	registerAlertRules(v1, DB)
	registerAlerts(v1, DB)
	registerSimulations(v1, DB)
	registerSimulationScenarios(v1, DB)
	registerAuditLogs(v1, DB)
	registerWebSockets(v1, DB)
}

func registerAuth(r *gin.RouterGroup, DB *gorm.DB) {
	auth := auth.NewHandler(DB)

	authGrp := r.Group("/auth")
	{
		// TODO: Restrict registration to ADMIN users after the initial admin/bootstrap flow exists.
		authGrp.POST("/register", auth.SignUp)
		authGrp.POST("/login", auth.LogIn)
		authGrp.POST("/logout", auth.LogOut)
		authGrp.GET("/me", middleware.JWTAuthMiddleware(), auth.GetCurrentUser)
	}
}

func registerUsers(r *gin.RouterGroup, DB *gorm.DB) {
	user := users.NewHandler(DB)

	userGrp := r.Group("/users", middleware.JWTAuthMiddleware())
	{
		userGrp.GET("", middleware.RequireRoles(models.Admin), user.GetAllUsers)
		userGrp.PUT("", user.UpdateUser)
		userGrp.DELETE("", middleware.RequireRoles(models.Admin), user.DeleteUser)
	}
}

func registerPlants(r *gin.RouterGroup, DB *gorm.DB) {
	plant := plants.NewHandler(DB)

	plantGrp := r.Group("/plants", middleware.JWTAuthMiddleware())
	{
		plantGrp.POST("", middleware.RequireRoles(models.Admin), plant.CreatePlant)
		plantGrp.GET("", plant.GetAllPlants)
		plantGrp.GET("/:plantId", plant.GetPlantByID)
		plantGrp.PUT("/:plantId", middleware.RequireRoles(models.Admin), plant.UpdatePlant)
		plantGrp.DELETE("/:plantId", middleware.RequireRoles(models.Admin), plant.DeletePlant)
	}
}

func registerProcessUnits(r *gin.RouterGroup, DB *gorm.DB) {
	processUnit := process_units.NewHandler(DB)

	plantProcessUnitGrp := r.Group("/plants/:plantId/process-units", middleware.JWTAuthMiddleware())
	{
		plantProcessUnitGrp.POST("", middleware.RequireRoles(models.Admin), processUnit.CreateProcessUnit)
		plantProcessUnitGrp.GET("", processUnit.GetProcessUnitsByPlantID)
	}

	processUnitGrp := r.Group("/process-units", middleware.JWTAuthMiddleware())
	{
		processUnitGrp.GET("/:processUnitId", processUnit.GetProcessUnitByID)
		processUnitGrp.PUT("/:processUnitId", middleware.RequireRoles(models.Admin), processUnit.UpdateProcessUnit)
		processUnitGrp.DELETE("/:processUnitId", middleware.RequireRoles(models.Admin), processUnit.DeleteProcessUnit)
	}
}

func registerDevices(r *gin.RouterGroup, DB *gorm.DB) {
	device := devices.NewHandler(DB)

	deviceGrp := r.Group("/devices", middleware.JWTAuthMiddleware())
	{
		deviceGrp.POST("", middleware.RequireRoles(models.Admin), device.CreateDevice)
		deviceGrp.GET("", device.GetAllDevices)
		deviceGrp.GET("/:deviceId", device.GetDeviceByID)
		deviceGrp.PUT("/:deviceId", middleware.RequireRoles(models.Admin), device.UpdateDevice)
		deviceGrp.DELETE("/:deviceId", middleware.RequireRoles(models.Admin), device.DeleteDevice)
		deviceGrp.POST("/:deviceId/connect", middleware.RequireRoles(models.Admin, models.Operator), device.ConnectDevice)
		deviceGrp.POST("/:deviceId/disconnect", middleware.RequireRoles(models.Admin, models.Operator), device.DisconnectDevice)
	}
}

func registerTags(r *gin.RouterGroup, DB *gorm.DB) {
	// tag := tags.NewHandler(DB)

	deviceTagGrp := r.Group("/devices/:deviceId/tags")
	{
		deviceTagGrp.POST("")
		deviceTagGrp.GET("")
	}

	processUnitTagGrp := r.Group("/process-units/:processUnitId/tags")
	{
		processUnitTagGrp.GET("")
	}

	tagGrp := r.Group("/tags")
	{
		tagGrp.GET("")
		tagGrp.GET("/:tagId")
		tagGrp.PUT("/:tagId")
		tagGrp.DELETE("/:tagId")
		tagGrp.POST("/:tagId/write")
	}
}

func registerReadings(r *gin.RouterGroup, DB *gorm.DB) {
	// reading := tag_readings.NewHandler(DB)

	readingGrp := r.Group("/readings")
	{
		readingGrp.GET("/latest")
		readingGrp.GET("/history")
	}
}

func registerAlertRules(r *gin.RouterGroup, DB *gorm.DB) {
	// alertRule := alert_rules.NewHandler(DB)

	alertRuleGrp := r.Group("/alert-rules")
	{
		alertRuleGrp.POST("")
		alertRuleGrp.GET("")
		alertRuleGrp.GET("/:ruleId")
		alertRuleGrp.PUT("/:ruleId")
		alertRuleGrp.DELETE("/:ruleId")
	}
}

func registerAlerts(r *gin.RouterGroup, DB *gorm.DB) {
	// alert := alerts.NewHandler(DB)

	alertGrp := r.Group("/alerts")
	{
		alertGrp.GET("")
		alertGrp.GET("/:alertId")
		alertGrp.POST("/:alertId/acknowledge")
		alertGrp.POST("/:alertId/resolve")
	}
}

func registerSimulations(r *gin.RouterGroup, DB *gorm.DB) {
	// simulation := simulations.NewHandler(DB)

	simulationGrp := r.Group("/simulations")
	{
		simulationGrp.POST("")
		simulationGrp.GET("")
		simulationGrp.GET("/:simulationId")
		simulationGrp.PUT("/:simulationId")
		simulationGrp.DELETE("/:simulationId")
		simulationGrp.POST("/:simulationId/start")
		simulationGrp.POST("/:simulationId/pause")
		simulationGrp.POST("/:simulationId/stop")
		simulationGrp.POST("/:simulationId/scenarios")
		simulationGrp.POST("/:simulationId/scenarios/:scenarioId/trigger")
	}
}

func registerSimulationScenarios(r *gin.RouterGroup, DB *gorm.DB) {
	// simulationScenario := simulation_scenarios.NewHandler(DB)

	simulationScenarioGrp := r.Group("/simulation-scenarios")
	{
		simulationScenarioGrp.GET("")
		simulationScenarioGrp.GET("/:scenarioId")
		simulationScenarioGrp.PUT("/:scenarioId")
		simulationScenarioGrp.DELETE("/:scenarioId")
	}
}

func registerAuditLogs(r *gin.RouterGroup, DB *gorm.DB) {
	// auditLog := audit_logs.NewHandler(DB)

	auditLogGrp := r.Group("/audit-logs")
	{
		auditLogGrp.GET("")
		auditLogGrp.GET("/:auditLogId")
	}
}

func registerWebSockets(r *gin.RouterGroup, DB *gorm.DB) {
	// websocket := websockets.NewHandler(DB)

	wsGrp := r.Group("/ws")
	{
		wsGrp.GET("/simulation")
	}
}
