package main

import (
	"plc-dashboard/config"
	"plc-dashboard/infrastructure"
)


func main() {
	config.LoadEnv()

	infrastructure.ConnectDb()

	infrastructure.RunGin(config.CORS())
}