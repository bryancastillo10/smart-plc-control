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
export type CreateTagRequest = Omit<CreateTagLocalRequest, "plantId">;

export interface CreateTagVariables {
	deviceId: string;
	body: CreateTagRequest;
}

export type UpdateTagRequest = Partial<CreateTagRequest>;

export interface UpdateTagVariables {
	tagId: string;
	body: UpdateTagRequest;
}

export interface TagFilters {
	plantId?: string;
	deviceId?: string;
	processUnitId?: string;
	enabled?: boolean;
}
