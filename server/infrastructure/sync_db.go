package infrastructure

import (
	"log"
	"plc-dashboard/models"
)

func SyncDatabase() {
	log.Println("Syncing declared database schema...")

	err := DB.AutoMigrate(
		&models.User{},
		&models.Plant{},
		&models.PlantSettings{},
		&models.Valve{},
		&models.SensorConfig{},
		&models.SensorRecord{},
	)

	if err != nil {
		log.Fatalf("Failed to auto-migrate the provided db schema: %v", err)
		return
	}

	log.Println("Database migration is successful")
}
