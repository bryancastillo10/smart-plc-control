package database

import (
	"log"
	"smart-plc-control-server/internal/models"
)

func SyncDatabase() {
	log.Println("Syncing declared database schema...")

	err := DB.AutoMigrate(
		&models.Users{},
		// &models.Plant{},
		// &models.Device{},
		// &models.Tag{},
		// &models.Reading{},
		// &models.AlertRule{},
		// &models.Alert{},
		// &models.Simulation{},
		// &models.SimulationScenario{},
		// &models.AuditLog{},
	)
	if err != nil {
		log.Fatalf("failed to auto-migrate database schema: %v", err)
	}

	log.Println("Database migration completed successfully")
}
