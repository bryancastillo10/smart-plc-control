import { useQuery } from "@tanstack/react-query";

import { simulationStreamQueryKeys } from "@/features/simulations/streamQueryKeys";
import type { SimulationTelemetrySnapshot } from "@/features/simulations/websocketTypes";

export function useSimulationTelemetry(plantId?: string) {
	return useQuery<SimulationTelemetrySnapshot>({
		enabled: false,
		queryKey: simulationStreamQueryKeys.telemetry(plantId ?? ""),
		queryFn: async () => {
			throw new Error(
				"Simulation telemetry is supplied by the WebSocket stream.",
			);
		},
	});
}

export function useSimulationReadings(plantId?: string) {
	const telemetry = useSimulationTelemetry(plantId);
	return {
		...telemetry,
		data: telemetry.data?.readings,
	};
}
