export function formatMetric(value: number | null | undefined, digits = 2) {
	if (value === null || value === undefined) {
		return "--";
	}

	return value.toFixed(digits);
}