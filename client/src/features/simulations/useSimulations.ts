import { useQuery } from "@tanstack/react-query";

import {
	getSimulation,
	listSimulations,
	simulationQueryKeys,
} from "@/features/simulations/queries";
import type { SimulationFilters } from "@/types/simulation";

export function useSimulations(filters?: SimulationFilters) {
	return useQuery({
		queryKey: simulationQueryKeys.list(filters),
		queryFn: () => listSimulations(filters),
	});
}

export function useSimulation(simulationId?: string) {
	return useQuery({
		enabled: Boolean(simulationId),
		queryKey: simulationQueryKeys.detail(simulationId ?? ""),
		queryFn: () => getSimulation(simulationId as string),
	});
}
