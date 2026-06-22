package main

import (
	"smart-plc-control-server/bootstrap"
	"smart-plc-control-server/platforms/config"
	"smart-plc-control-server/platforms/database"
)

func main() {
	config.LoadEnvVariables()

	database.ConnectDb()

	bootstrap.RunGin(config.CORS())
}
