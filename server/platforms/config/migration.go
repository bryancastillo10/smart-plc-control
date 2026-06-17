package config

import (
	"flag"
	"log"
	"os"
	"smart-plc-control-server/platforms/database"
)

func HandleMigrationFlag() {
	migrateFlag := flag.Bool("migrate", false, "run db migration and exit")
	flag.Parse()

	if *migrateFlag {
		database.ConnectDb()

		log.Println("Starting automigrate...")
		// database.SyncDatabase()

		log.Println("Migration complete... exiting...")
		os.Exit(0)
	} else {
		log.Println("Skipping db migation (flag was not set)")
	}
}