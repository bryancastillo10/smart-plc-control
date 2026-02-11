package plantsettings

type UpdatePlantSettingsRequest struct {
	Interval    int32   `json:"interval" binding:"required,min=500"`
	NoiseFactor float64 `json:"noiseFactor" binding:"required,min=0"`
}
