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

type GetPlantListResponse struct {
	ID          string                `json:"id"`
	Name        string                `json:"name"`
	Location    string                `json:"location"`
	Description *string               `json:"description,omitempty"`
	Settings    PlantSettingsResponse `json:"settings"`
	ValveCount  int                   `json:"valveCount"`
}

type GetPlantResponse struct {
	ID          string                `json:"id"`
	Name        string                `json:"name" binding:"required"`
	Location    string                `json:"location" binding:"required"`
	Description *string               `json:"description,omitempty"`
	Settings    PlantSettingsResponse `json:"settings" binding:"required"`
	Valve       []ValveItem           `json:"valves" binding:"required,min=1"`
}

type PlantSettingsResponse struct {
	ID          string  `json:"id"`
	UpdatedBy   string  `json:"updatedBy"`
	Interval    int32   `json:"interval"`
	NoiseFactor float64 `json:"noiseFactor"`
}

type ValveItem struct {
	ID          string   `json:"id"`
	Name        string   `json:"valveName"`
	Location    string   `json:"location"`
	Description *string  `json:"description,omitempty"`
	Position    *float64 `json:"position,omitempty"`
	IsAuto      *bool    `json:"isAuto,omitempty"`
}
