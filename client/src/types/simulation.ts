import type { SimulationStatus } from "@/types/enum";

export interface Simulation {
	id: string;
	plantId: string;
	name: string;
	status: SimulationStatus;
	updateIntervalMs: number;
	noiseFactor: number;
	startedAt?: string | null;
	pausedAt?: string | null;
	stoppedAt?: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CreateSimulationLocalRequest {
	plantId: string;
	name: string;
	status?: SimulationStatus;
	updateIntervalMs?: number;
	noiseFactor?: number;
}

export type CreateSimulationLocalVariables = CreateSimulationLocalRequest;
