import type {
	CreateSimulationLocalVariables,
	Simulation,
} from "@/types/simulation";
import { apiFetch } from "@/utils/fetch";

export function createSimulation(body: CreateSimulationLocalVariables) {
	return apiFetch<Simulation, CreateSimulationLocalVariables>("/simulations", {
		method: "POST",
		body,
		credentials: "include",
	});
}
