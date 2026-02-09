package sensorconfig

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
