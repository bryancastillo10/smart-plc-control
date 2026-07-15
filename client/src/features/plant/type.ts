import type { AlertRule } from "@/types/alert-rule";
import type { Device } from "@/types/device";
import type { Language, PlantStatus, UserRole } from "@/types/enum";
import type { ProcessUnit } from "@/types/process-unit";
import type { ProcessUnitConnection } from "@/types/process-unit-connection";
import type { Simulation } from "@/types/simulation";
import type { SimulationScenario } from "@/types/simulation-scenario";
import type { Tag } from "@/types/tag";

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

export interface Plant {
	id: string;
	name: string;
	location: string;
	description?: string;
	status: PlantStatus;
	accessibleBy: string[];
}

export type PlantSetupStepId =
	| "plant"
	| "processUnits"
	| "diagram"
	| "devices"
	| "tags"
	| "alertRules"
	| "simulation"
	| "users"
	| "review"
	| "dashboard";

export interface PlantSetupStep {
	id: PlantSetupStepId;
	title: string;
	description: string;
}

export interface PlantSetupUser {
	id: string;
	username: string;
	email: string;
	role: UserRole;
	language: Language;
}

export interface PlantSetupWorkflowState {
	plant: Plant | null;
	processUnits: ProcessUnit[];
	processUnitConnections: ProcessUnitConnection[];
	devices: Device[];
	tags: Tag[];
	alertRules: AlertRule[];
	simulations: Simulation[];
	simulationScenarios: SimulationScenario[];
	users: PlantSetupUser[];
}

export type PlantSetupEntityInput<T extends { id: string }> = Omit<T, "id"> & {
	id?: string;
};

export type PlantSetupPlantInput = PlantSetupEntityInput<Plant>;