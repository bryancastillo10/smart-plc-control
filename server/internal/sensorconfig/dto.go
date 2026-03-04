package sensorconfig

import "github.com/google/uuid"

type SensorTemplate struct {
	Sensor      string
	BaseMin     float64
	BaseMax     float64
	EffectScale float64
}

var DefaultValveSensors = []SensorTemplate{
	{"flowRate", 10, 50, 1.0},
	{"pressure", 1, 5, 0.6},
}

var DefaultPlantSensors = []SensorTemplate{
	{"ph", 6.5, 8.5, 0.2},
	{"turbidity", 0, 5, 0.3},
	{"dissolvedOxygen", 4, 9, 0.2},
	{"temperature", 20, 32, 0.4},
}

type CreateSensorConfigRequest struct {
	ValveID     *uuid.UUID `json:"valveId,omitempty"`
	Sensor      string     `json:"sensor" binding:"required"`
	BaseMin     float64    `json:"baseMin" binding:"required"`
	BaseMax     float64    `json:"baseMax" binding:"required"`
	EffectScale float64    `json:"effectScale" binding:"required"`
}

type UpdateSensorConfigRequest struct {
	ValveID     *uuid.UUID `json:"valveId,omitempty"`
	Sensor      *string    `json:"sensor,omitempty"`
	BaseMin     *float64   `json:"baseMin,omitempty"`
	BaseMax     *float64   `json:"baseMax,omitempty"`
	EffectScale *float64   `json:"effectScale,omitempty"`
}

type SensorConfigResponse struct {
	ID          string     `json:"id"`
	PlantID     string     `json:"plantId"`
	ValveID     *uuid.UUID `json:"valveId,omitempty"`
	Sensor      string     `json:"sensor"`
	BaseMin     float64    `json:"baseMin"`
	BaseMax     float64    `json:"baseMax"`
	EffectScale float64    `json:"effectScale"`
}
