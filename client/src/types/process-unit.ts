import type { PlantStatus } from "@/types/enum";

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
