import type {
	AlertOperator,
	AlertSeverity,
	DeviceType,
	Language,
	PlantStatus,
	Protocol,
	SimulationStatus,
	TagDataType,
	UserRole,
} from "@/types/enum";

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

export interface PlantSetupPlant {
	id: string;
	name: string;
	location: string;
	description?: string;
	status: PlantStatus;
}

export interface PlantSetupProcessUnit {
	id: string;
	name: string;
	type: string;
	description?: string;
	status: PlantStatus;
	position: { x: number; y: number };
	icon: string;
}

export interface PlantSetupProcessUnitConnection {
	id: string;
	sourceProcessUnitId: string;
	targetProcessUnitId: string;
	label?: string;
	flowType?: string;
}

export interface PlantSetupDevice {
	id: string;
	name: string;
	type: DeviceType;
	protocol: Protocol;
	description?: string;
	host?: string;
	port?: number;
	enabled: boolean;
	icon: string;
}

export interface PlantSetupTag {
	id: string;
	name: string;
	deviceId: string;
	processUnitId?: string;
	dataType: TagDataType;
	unit?: string;
	enabled: boolean;
}

export interface PlantSetupAlertRule {
	id: string;
	name: string;
	tagId: string;
	operator: AlertOperator;
	threshold: string;
	severity: AlertSeverity;
	enabled: boolean;
}

export interface PlantSetupSimulation {
	id: string;
	name: string;
	deviceId: string;
	status: SimulationStatus;
}

export interface PlantSetupSimulationScenario {
	id: string;
	simulationId: string;
	name: string;
	description?: string;
}

export interface PlantSetupUser {
	id: string;
	username: string;
	email: string;
	role: UserRole;
	language: Language;
}

export interface PlantSetupWorkflowState {
	plant: PlantSetupPlant | null;
	processUnits: PlantSetupProcessUnit[];
	processUnitConnections: PlantSetupProcessUnitConnection[];
	devices: PlantSetupDevice[];
	tags: PlantSetupTag[];
	alertRules: PlantSetupAlertRule[];
	simulations: PlantSetupSimulation[];
	simulationScenarios: PlantSetupSimulationScenario[];
	users: PlantSetupUser[];
}
