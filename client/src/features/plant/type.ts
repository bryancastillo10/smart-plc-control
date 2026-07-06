import type { PlantStatus } from "@/types/enum";

export interface CreatePlantRequest {
	name: string;
	location: string;
	description?: string;
	status?: PlantStatus;
}

export type CreatePlantVariables = CreatePlantRequest;

export interface PlantResponse {
	id: string;
	name: string;
	location: string;
	description: string;
	status: PlantStatus;
	accessibleBy: string[];
	createdAt: string;
	updatedAt: string;
}
