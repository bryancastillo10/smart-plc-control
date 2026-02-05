package models

import "time"

type PlcSensors struct {
	Timestamp         time.Time `json:"timestamp"`
	FlowRate          float64   `json:"flowRate"`          // m3/s
	PH                float64   `json:"pH"`                // 0–14
	Turbidity         float64   `json:"turbidity"`         // NTU
	DissolvedOxygen   float64   `json:"dissolvedOxygen"`   // mg/L
	Temperature       float64   `json:"temperature"`       // °C
}