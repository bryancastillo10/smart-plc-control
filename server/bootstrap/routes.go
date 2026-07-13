package bootstrap

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"smart-plc-control-server/internal/alert_rules"
	"smart-plc-control-server/internal/alerts"
	"smart-plc-control-server/internal/audit_logs"
	"smart-plc-control-server/internal/auth"
	"smart-plc-control-server/internal/devices"
	"smart-plc-control-server/internal/middleware"
	"smart-plc-control-server/internal/models"
	"smart-plc-control-server/internal/plants"
	"smart-plc-control-server/internal/process_units"
	"smart-plc-control-server/internal/simulations"
	"smart-plc-control-server/internal/tag_readings"
	"smart-plc-control-server/internal/tags"
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

	plantProcessUnitConnectionGrp := r.Group("/plants/:plantId/process-unit-connections", middleware.JWTAuthMiddleware())
	{
		plantProcessUnitConnectionGrp.POST("", middleware.RequireRoles(models.Admin), processUnit.CreateProcessUnitConnection)
		plantProcessUnitConnectionGrp.GET("", processUnit.GetProcessUnitConnectionsByPlantID)
	}

	processUnitGrp := r.Group("/process-units", middleware.JWTAuthMiddleware())
	{
		processUnitGrp.GET("/:processUnitId", processUnit.GetProcessUnitByID)
		processUnitGrp.PUT("/:processUnitId", middleware.RequireRoles(models.Admin), processUnit.UpdateProcessUnit)
		processUnitGrp.DELETE("/:processUnitId", middleware.RequireRoles(models.Admin), processUnit.DeleteProcessUnit)
	}

	processUnitConnectionGrp := r.Group("/process-unit-connections", middleware.JWTAuthMiddleware())
	{
		processUnitConnectionGrp.GET("/:connectionId", processUnit.GetProcessUnitConnectionByID)
		processUnitConnectionGrp.PUT("/:connectionId", middleware.RequireRoles(models.Admin), processUnit.UpdateProcessUnitConnection)
		processUnitConnectionGrp.DELETE("/:connectionId", middleware.RequireRoles(models.Admin), processUnit.DeleteProcessUnitConnection)
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
	tag := tags.NewHandler(DB)

	deviceTagGrp := r.Group("/devices/:deviceId/tags", middleware.JWTAuthMiddleware())
	{
		deviceTagGrp.POST("", middleware.RequireRoles(models.Admin), tag.CreateTag)
		deviceTagGrp.GET("", tag.GetTagsByDeviceID)
	}

	processUnitTagGrp := r.Group("/process-units/:processUnitId/tags", middleware.JWTAuthMiddleware())
	{
		processUnitTagGrp.GET("", tag.GetTagsByProcessUnitID)
	}

	tagGrp := r.Group("/tags", middleware.JWTAuthMiddleware())
	{
		tagGrp.GET("", tag.GetTags)
		tagGrp.GET("/:tagId", tag.GetTagByID)
		tagGrp.PUT("/:tagId", middleware.RequireRoles(models.Admin), tag.UpdateTag)
		tagGrp.DELETE("/:tagId", middleware.RequireRoles(models.Admin), tag.DeleteTag)
	}
}

func registerReadings(r *gin.RouterGroup, DB *gorm.DB) {
	reading := tag_readings.NewHandler(DB)

	readingGrp := r.Group("/readings", middleware.JWTAuthMiddleware())
	{
		readingGrp.GET("/latest", reading.GetLatestReadings)
		readingGrp.GET("/history", reading.GetHistoryReadings)
	}
}

func registerAlertRules(r *gin.RouterGroup, DB *gorm.DB) {
	alertRule := alert_rules.NewHandler(DB)

	alertRuleGrp := r.Group("/alert-rules", middleware.JWTAuthMiddleware())
	{
		alertRuleGrp.POST("", middleware.RequireRoles(models.Admin), alertRule.CreateAlertRule)
		alertRuleGrp.GET("", alertRule.GetAlertRules)
		alertRuleGrp.GET("/:ruleId", alertRule.GetAlertRuleByID)
		alertRuleGrp.PUT("/:ruleId", middleware.RequireRoles(models.Admin), alertRule.UpdateAlertRule)
		alertRuleGrp.DELETE("/:ruleId", middleware.RequireRoles(models.Admin, models.Operator), alertRule.DeleteAlertRule)
	}
}

func registerAlerts(r *gin.RouterGroup, DB *gorm.DB) {
	alert := alerts.NewHandler(DB)

	alertGrp := r.Group("/alerts", middleware.JWTAuthMiddleware())
	{
		alertGrp.GET("", alert.GetAlerts)
		alertGrp.GET("/:alertId", alert.GetAlertByID)
		alertGrp.POST("/:alertId/acknowledge", middleware.RequireRoles(models.Admin, models.Operator), alert.AcknowledgeAlert)
		alertGrp.POST("/:alertId/resolve", middleware.RequireRoles(models.Admin, models.Operator), alert.ResolveAlert)
	}
}

func registerSimulations(r *gin.RouterGroup, DB *gorm.DB) {
	simulation := simulations.NewHandler(DB)

	simulationGrp := r.Group("/simulations", middleware.JWTAuthMiddleware())
	{
		simulationGrp.POST("", middleware.RequireRoles(models.Admin), simulation.CreateSimulation)
		simulationGrp.GET("", simulation.GetSimulations)
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
	auditLog := audit_logs.NewHandler(DB)

	auditLogGrp := r.Group("/audit-logs", middleware.JWTAuthMiddleware(), middleware.RequireRoles(models.Admin))
	{
		auditLogGrp.GET("", auditLog.GetAuditLogs)
		auditLogGrp.GET("/:auditLogId", auditLog.GetAuditLogByID)
	}
}

func registerWebSockets(r *gin.RouterGroup, DB *gorm.DB) {
	// websocket := websockets.NewHandler(DB)

	wsGrp := r.Group("/ws")
	{
		wsGrp.GET("/simulation")
	}
}
