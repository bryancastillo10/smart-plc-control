import { useQuery } from "@tanstack/react-query";

import {
	getSimulationScenario,
	listSimulationScenarios,
	simulationScenarioQueryKeys,
} from "@/features/simulation_scenarios/queries";
import type { SimulationScenarioFilters } from "@/types/simulation-scenario";

export function useSimulationScenarios(filters?: SimulationScenarioFilters) {
	return useQuery({
		queryKey: simulationScenarioQueryKeys.list(filters),
		queryFn: () => listSimulationScenarios(filters),
	});
}

export function useSimulationScenario(scenarioId?: string) {
	return useQuery({
		enabled: Boolean(scenarioId),
		queryKey: simulationScenarioQueryKeys.detail(scenarioId ?? ""),
		queryFn: () => getSimulationScenario(scenarioId as string),
	});
}
