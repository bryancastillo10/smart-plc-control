import type {
	CreateSimulationVariables,
	Simulation,
	SimulationFilters,
	UpdateSimulationVariables,
} from "@/types/simulation";
import { apiFetch } from "@/utils/fetch";

export const simulationQueryKeys = {
	all: ["simulations"] as const,
	detail: (simulationId: string) =>
		[...simulationQueryKeys.all, simulationId] as const,
	list: (filters?: SimulationFilters) =>
		[...simulationQueryKeys.all, filters] as const,
};

export function listSimulations(filters?: SimulationFilters) {
	return apiFetch<Simulation[]>(createSimulationListPath(filters), {
		credentials: "include",
	});
}

export function getSimulation(simulationId: string) {
	return apiFetch<Simulation>(`/simulations/${simulationId}`, {
		credentials: "include",
	});
}

export function createSimulation(body: CreateSimulationVariables) {
	return apiFetch<Simulation, CreateSimulationVariables>("/simulations", {
		method: "POST",
		body,
		credentials: "include",
	});
}

export function updateSimulation({ body, simulationId }: UpdateSimulationVariables) {
	return apiFetch<Simulation, UpdateSimulationVariables["body"]>(
		`/simulations/${simulationId}`,
		{
			method: "PUT",
			body,
			credentials: "include",
		},
	);
}

export function deleteSimulation(simulationId: string) {
	return apiFetch<void>(`/simulations/${simulationId}`, {
		method: "DELETE",
		credentials: "include",
	});
}

export function startSimulation(simulationId: string) {
	return apiFetch<Simulation>(`/simulations/${simulationId}/start`, {
		method: "POST",
		credentials: "include",
	});
}

export function pauseSimulation(simulationId: string) {
	return apiFetch<Simulation>(`/simulations/${simulationId}/pause`, {
		method: "POST",
		credentials: "include",
	});
}

export function stopSimulation(simulationId: string) {
	return apiFetch<Simulation>(`/simulations/${simulationId}/stop`, {
		method: "POST",
		credentials: "include",
	});
}

function createSimulationListPath(filters?: SimulationFilters) {
	const params = new URLSearchParams();

	if (filters?.plantId) params.set("plantId", filters.plantId);
	if (filters?.status) params.set("status", filters.status);

	const queryString = params.toString();
	return queryString ? `/simulations?${queryString}` : "/simulations";
}
