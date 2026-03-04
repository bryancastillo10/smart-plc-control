package plantsettings

type UpdatePlantSettingsRequest struct {
	Interval    int32   `json:"interval" binding:"required,min=500"`
	NoiseFactor float64 `json:"noiseFactor" binding:"required,min=0"`
}

type PlantSettingsResponse struct {
	ID          string  `json:"id"`
	PlantID     string  `json:"plantId"`
	UpdatedBy   string  `json:"updatedBy"`
	Interval    int32   `json:"interval"`
	NoiseFactor float64 `json:"noiseFactor"`
}
