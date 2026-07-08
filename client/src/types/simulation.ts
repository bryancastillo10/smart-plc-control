import type { SimulationStatus } from "@/types/enum";

export interface Simulation {
	id: string;
	plantId?: string;
	deviceId?: string;
	name: string;
	description?: string;
	status: SimulationStatus;
}

export interface CreateSimulationLocalRequest {
	plantId?: string;
	deviceId?: string;
	name: string;
	description?: string;
	status: SimulationStatus;
}

export type CreateSimulationLocalVariables = CreateSimulationLocalRequest;
