export interface SimulationScenario {
	id: string;
	simulationId: string;
	name: string;
	description?: string;
	enabled: boolean;
}

export interface CreateSimulationScenarioLocalRequest {
	simulationId: string;
	name: string;
	description?: string;
	enabled: boolean;
}

export type CreateSimulationScenarioLocalVariables =
	CreateSimulationScenarioLocalRequest;
