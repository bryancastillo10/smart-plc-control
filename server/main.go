package main

import (
	"plc-dashboard/config"
	"plc-dashboard/infrastructure"
)


func main() {
	config.LoadEnv()

	infrastructure.RunGin(config.CORS())
}