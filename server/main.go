package main

import (
	"plc-dashboard/config"
	"plc-dashboard/infrastructure"
)

func main() {
	config.LoadEnv()

	// add --migrate in running Go if it needs db migration
	config.HandleMigrationFlag()

	infrastructure.ConnectDb()

	infrastructure.RunGin(config.CORS())
}
