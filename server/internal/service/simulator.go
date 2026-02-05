package service

import (
	"math/rand"

	"time"

	"plc-dashboard/internal/models"
)

func randomRange(min,max float64) float64 {
	return min + rand.Float64()*(max-min)
}

func GenerateSensorData() models.PlcSensors {
	return models.PlcSensors{
		Timestamp: time.Now(),
		FlowRate: randomRange(0.8,1.5),
		PH:              randomRange(6.5, 8.2),
		Turbidity:       randomRange(1.0, 10.0),
		DissolvedOxygen: randomRange(4.0, 9.0),
		Temperature:     randomRange(20.0, 32.0),
	}
}