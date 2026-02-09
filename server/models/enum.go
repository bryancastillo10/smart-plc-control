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