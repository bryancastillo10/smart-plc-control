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
