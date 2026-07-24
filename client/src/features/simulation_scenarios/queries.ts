import type {
	CreateSimulationScenarioVariables,
	SimulationScenario,
	SimulationScenarioFilters,
	UpdateSimulationScenarioVariables,
} from "@/types/simulation-scenario";
import { apiFetch } from "@/utils/fetch";

export const simulationScenarioQueryKeys = {
	all: ["simulation-scenarios"] as const,
	detail: (scenarioId: string) =>
		[...simulationScenarioQueryKeys.all, scenarioId] as const,
	list: (filters?: SimulationScenarioFilters) =>
		[...simulationScenarioQueryKeys.all, filters] as const,
};

export function listSimulationScenarios(filters?: SimulationScenarioFilters) {
	return apiFetch<SimulationScenario[]>(createScenarioListPath(filters), {
		credentials: "include",
	});
}

export function getSimulationScenario(scenarioId: string) {
	return apiFetch<SimulationScenario>(`/simulation-scenarios/${scenarioId}`, {
		credentials: "include",
	});
}

export function createSimulationScenario({
	body,
	simulationId,
}: CreateSimulationScenarioVariables) {
	return apiFetch<
		SimulationScenario,
		CreateSimulationScenarioVariables["body"]
	>(`/simulations/${simulationId}/scenarios`, {
		method: "POST",
		body,
		credentials: "include",
	});
}

export function updateSimulationScenario({
	body,
	scenarioId,
}: UpdateSimulationScenarioVariables) {
	return apiFetch<
		SimulationScenario,
		UpdateSimulationScenarioVariables["body"]
	>(`/simulation-scenarios/${scenarioId}`, {
		method: "PUT",
		body,
		credentials: "include",
	});
}

export function deleteSimulationScenario(scenarioId: string) {
	return apiFetch<void>(`/simulation-scenarios/${scenarioId}`, {
		method: "DELETE",
		credentials: "include",
	});
}

export function triggerSimulationScenario({
	scenarioId,
	simulationId,
}: {
	scenarioId: string;
	simulationId: string;
}) {
	return apiFetch<SimulationScenario>(
		`/simulations/${simulationId}/scenarios/${scenarioId}/trigger`,
		{
			method: "POST",
			credentials: "include",
		},
	);
}

function createScenarioListPath(filters?: SimulationScenarioFilters) {
	const params = new URLSearchParams();

	if (filters?.simulationId) params.set("simulationId", filters.simulationId);
	if (filters?.enabled !== undefined) params.set("enabled", String(filters.enabled));

	const queryString = params.toString();
	return queryString ? `/simulation-scenarios?${queryString}` : "/simulation-scenarios";
}
