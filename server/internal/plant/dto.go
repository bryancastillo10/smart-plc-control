package plant

type CreatePlantRequest struct {
	Name        string  `json:"name" binding:"required"`
	Location    string  `json:"location" binding:"required"`
	Description *string `json:"description,omitempty"`

	Settings InitialPlantSettingsRequest `json:"settings" binding:"required"`
	Valves   []InitialValveRequest       `json:"valves" binding:"required,min=1"`
}

type InitialPlantSettingsRequest struct {
	Interval    int32   `json:"interval" binding:"required,min=500"`
	NoiseFactor float64 `json:"noiseFactor" binding:"required,min=0"`
}

type InitialValveRequest struct {
	Name        string  `json:"name" binding:"required"`
	Location    string  `json:"location,omitempty"`
	Description *string `json:"description,omitempty"`

	Position *float64 `json:"position,omitempty"`
	IsAuto   *bool    `json:"isAuto,omitempty"`
}
