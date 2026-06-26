package utils

func PatchIfNotZero[T comparable](target *T, value T) bool {
	if target == nil {
		return false
	}

	var zero T
	if value == zero {
		return false
	}

	*target = value
	return true
}
