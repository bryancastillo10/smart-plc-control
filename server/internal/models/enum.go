package models

type Role string

const (
	Admin Role = "ADMIN"
	Operator Role = "OPERATOR"
	Viewer Role = "VIEWER"
)

type Language string

const (
	English Language = "EN"
	Chinese Language = "ZH-TW"
)

type PlantStatus string

const (
	Active	PlantStatus = "ACTIVE"
	Inactive PlantStatus = "INACTIVE"
	Maintenance PlantStatus = "MAINTENANCE"
)