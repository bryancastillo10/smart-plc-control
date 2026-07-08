import type { AlertRule } from "@/types/alert-rule";
import type { Device } from "@/types/device";
import type { Language, UserRole } from "@/types/enum";
import type { Plant } from "@/types/plant";
import type { ProcessUnit } from "@/types/process-unit";
import type { ProcessUnitConnection } from "@/types/process-unit-connection";
import type { Simulation } from "@/types/simulation";
import type { SimulationScenario } from "@/types/simulation-scenario";
import type { Tag } from "@/types/tag";

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
export type PlantSetupProcessUnitInput = PlantSetupEntityInput<ProcessUnit>;
export type PlantSetupProcessUnitConnectionInput =
	PlantSetupEntityInput<ProcessUnitConnection>;
export type PlantSetupDeviceInput = PlantSetupEntityInput<Device>;
export type PlantSetupTagInput = PlantSetupEntityInput<Tag>;
export type PlantSetupAlertRuleInput = PlantSetupEntityInput<AlertRule>;
export type PlantSetupSimulationInput = PlantSetupEntityInput<Simulation>;
export type PlantSetupSimulationScenarioInput =
	PlantSetupEntityInput<SimulationScenario>;
export type PlantSetupUserInput = PlantSetupEntityInput<PlantSetupUser>;