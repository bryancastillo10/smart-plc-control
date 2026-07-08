import type { PlantStatus } from "@/types/enum";

export interface Plant {
	id: string;
	name: string;
	location: string;
	description?: string;
	status: PlantStatus;
	accessibleBy: string[];
}

export interface CreatePlantLocalRequest {
	name: string;
	location: string;
	description?: string;
	status: PlantStatus;
	accessibleBy?: string[];
}

export type CreatePlantLocalVariables = CreatePlantLocalRequest;
