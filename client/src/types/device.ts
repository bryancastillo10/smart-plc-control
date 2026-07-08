import type { ConnectionStatus, DeviceType, Protocol } from "@/types/enum";
import type { ProcessUnitPosition } from "@/types/process-unit";

export interface Device {
	id: string;
	plantId?: string;
	name: string;
	type: DeviceType;
	description?: string;
	protocol: Protocol;
	host?: string;
	port?: number;
	connectionStatus: ConnectionStatus;
	enabled: boolean;
	lastConnectedAt?: string;
	position: ProcessUnitPosition;
	icon: string;
}

export interface CreateDeviceLocalRequest {
	plantId?: string;
	name: string;
	type: DeviceType;
	description?: string;
	protocol: Protocol;
	host?: string;
	port?: number;
	connectionStatus: ConnectionStatus;
	enabled: boolean;
	position: ProcessUnitPosition;
	icon: string;
}

export type CreateDeviceLocalVariables = CreateDeviceLocalRequest;
