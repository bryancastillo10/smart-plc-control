import { useQuery } from "@tanstack/react-query";

import { simulationTelemetryQueryOptions } from "@/features/simulations/queries";

export function useSimulationTelemetry(plantId?: string) {
	return useQuery(simulationTelemetryQueryOptions(plantId));
}

export function useSimulationReadings(plantId?: string) {
	const telemetry = useSimulationTelemetry(plantId);
	return {
		...telemetry,
		data: telemetry.data?.readings,
	};
}
