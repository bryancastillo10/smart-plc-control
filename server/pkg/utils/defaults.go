package utils

func DefaultFloat(v *float64, def float64) float64 {
	if v != nil {
		return *v
	}
	return def
}

func DefaultBool(v *bool, def bool) bool {
	if v != nil {
		return *v
	}
	return def
}
