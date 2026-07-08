import type { TagDataType } from "@/types/enum";

export interface Tag {
	id: string;
	plantId?: string;
	deviceId: string;
	processUnitId?: string;
	name: string;
	address: string;
	dataType: TagDataType;
	unit?: string;
	description?: string;
	enabled: boolean;
}

export interface CreateTagLocalRequest {
	plantId?: string;
	deviceId: string;
	processUnitId?: string;
	name: string;
	address: string;
	dataType: TagDataType;
	unit?: string;
	description?: string;
	enabled: boolean;
}

export type CreateTagLocalVariables = CreateTagLocalRequest;
