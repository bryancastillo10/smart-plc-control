package database

import (
	"log"
	"smart-plc-control-server/internal/models"
)

func SyncDatabase() {
	log.Println("Syncing declared database schema...")

	err := DB.AutoMigrate(
		&models.Users{},
		&models.Plants{},
		&models.Devices{},
		&models.Tags{},
		&models.TagReadings{},
		&models.Alerts{},
		&models.AlertRules{},
		&models.Simulations{},
		&models.SimulationScenarios{},
		&models.AuditLogs{},
	)
	if err != nil {
		log.Fatalf("failed to auto-migrate database schema: %v", err)
	}

	log.Println("Database migration completed successfully")
}
