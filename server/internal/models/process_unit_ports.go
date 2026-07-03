package models

type ProcessUnitPort struct {
	ID        string           `json:"id"`
	Label     string           `json:"label"`
	Direction ProcessDirection `json:"direction"`
}
