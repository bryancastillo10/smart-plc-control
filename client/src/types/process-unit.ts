import type { PlantStatus } from "@/types/enum";
import type { ProcessUnitConnection } from "@/types/process-unit-connection";

export type ProcessUnitPortDirection = "IN" | "OUT";

export interface ProcessUnitPosition {
	x: number;
	y: number;
}

export interface ProcessUnitPort {
	id: string;
	label: string;
	direction: ProcessUnitPortDirection;
}

export interface ProcessUnit {
	id: string;
	plantId?: string;
	name: string;
	type: string;
	description?: string;
	status: PlantStatus;
	position: ProcessUnitPosition;
	ports: ProcessUnitPort[];
	icon: string;
}

export interface CreateProcessUnitLocalRequest {
	plantId?: string;
	name: string;
	type: string;
	description?: string;
	status: PlantStatus;
	position: ProcessUnitPosition;
	ports: ProcessUnitPort[];
	icon: string;
}

export type CreateProcessUnitLocalVariables = CreateProcessUnitLocalRequest;
export type CreateProcessUnitRequest = Omit<CreateProcessUnitLocalRequest, "plantId">;

export interface CreateProcessUnitVariables {
	plantId: string;
	body: CreateProcessUnitRequest;
}

export type UpdateProcessUnitRequest = Partial<CreateProcessUnitRequest>;

export interface UpdateProcessUnitVariables {
	processUnitId: string;
	body: UpdateProcessUnitRequest;
}

export interface ProcessUnitMutationResponse {
	processUnit?: ProcessUnit;
	deletedProcessUnitId?: string;
	connections: ProcessUnitConnection[];
}
