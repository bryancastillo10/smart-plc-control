package valve

type UpdateValveRequest struct {
	Position *float64 `json:"position,omitempty" binding:"omitempty,min=0,max=100"`
	IsAuto   *bool    `json:"isAuto,omitempty"`
}

type ValveResponse struct {
	ID          string   `json:"id"`
	PlantID     string   `json:"plantId"`
	Name        string   `json:"name"`
	Location    string   `json:"location"`
	Description *string  `json:"description,omitempty"`
	Position    float64  `json:"position"`
	IsAuto      bool     `json:"isAuto"`
}
