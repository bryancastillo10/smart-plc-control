package valve

type UpdateValveRequest struct {
	Position *float64 `json:"position,omitempty" binding:"omitempty,min=0,max=100"`
	IsAuto   *bool    `json:"isAuto,omitempty"`
}
