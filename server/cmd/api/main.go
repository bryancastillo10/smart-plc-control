package main

import (
	"smart-plc-control-server/bootstrap"
	"smart-plc-control-server/platforms/config"
	"smart-plc-control-server/platforms/database"
)

func main() {
	config.LoadEnvVariables()

	// add --migrate in running Go if it needs db migration
	config.HandleMigrationFlag()

	database.ConnectDb()

	bootstrap.RunGin(config.CORS())
}
