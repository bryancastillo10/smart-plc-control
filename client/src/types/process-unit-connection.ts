export type ProcessUnitFlowType =
	| "WATER"
	| "WASTEWATER"
	| "SLUDGE"
	| "GAS"
	| "CHEMICAL"
	| "RAW_MATERIAL"
	| "OTHERS";

export interface ProcessUnitConnection {
	id: string;
	plantId?: string;
	sourceUnitId: string;
	sourcePortId: string;
	targetUnitId: string;
	targetPortId: string;
	label?: string;
	flowType?: ProcessUnitFlowType;
}

export interface CreateProcessUnitConnectionLocalRequest {
	plantId?: string;
	sourceUnitId: string;
	sourcePortId: string;
	targetUnitId: string;
	targetPortId: string;
	label?: string;
	flowType?: ProcessUnitFlowType;
}

export type CreateProcessUnitConnectionLocalVariables =
	CreateProcessUnitConnectionLocalRequest;
export type CreateProcessUnitConnectionRequest = Omit<
	CreateProcessUnitConnectionLocalRequest,
	"plantId"
>;

export interface CreateProcessUnitConnectionVariables {
	plantId: string;
	body: CreateProcessUnitConnectionRequest;
}

export type UpdateProcessUnitConnectionRequest =
	Partial<CreateProcessUnitConnectionRequest>;

export interface UpdateProcessUnitConnectionVariables {
	connectionId: string;
	body: UpdateProcessUnitConnectionRequest;
}
