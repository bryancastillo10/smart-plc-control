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
export type CreateSimulationScenarioRequest = Omit<
	CreateSimulationScenarioLocalRequest,
	"simulationId"
>;

export interface CreateSimulationScenarioVariables {
	simulationId: string;
	body: CreateSimulationScenarioRequest;
}

export type UpdateSimulationScenarioRequest =
	Partial<CreateSimulationScenarioRequest>;

export interface UpdateSimulationScenarioVariables {
	scenarioId: string;
	body: UpdateSimulationScenarioRequest;
}

export interface SimulationScenarioFilters {
	simulationId?: string;
	enabled?: boolean;
}
