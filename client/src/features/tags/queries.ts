import type {
	CreateTagVariables,
	Tag,
	TagFilters,
	UpdateTagVariables,
} from "@/types/tag";
import { apiFetch } from "@/utils/fetch";

export const tagQueryKeys = {
	all: ["tags"] as const,
	byDevice: (deviceId: string) => [...tagQueryKeys.all, "device", deviceId] as const,
	byProcessUnit: (processUnitId: string) =>
		[...tagQueryKeys.all, "process-unit", processUnitId] as const,
	detail: (tagId: string) => [...tagQueryKeys.all, tagId] as const,
	list: (filters?: TagFilters) => [...tagQueryKeys.all, filters] as const,
};

export function listTags(filters?: TagFilters) {
	return apiFetch<Tag[]>(createTagListPath(filters), {
		credentials: "include",
	});
}

export function listDeviceTags(deviceId: string) {
	return apiFetch<Tag[]>(`/devices/${deviceId}/tags`, {
		credentials: "include",
	});
}

export function listProcessUnitTags(processUnitId: string) {
	return apiFetch<Tag[]>(`/process-units/${processUnitId}/tags`, {
		credentials: "include",
	});
}

export function getTag(tagId: string) {
	return apiFetch<Tag>(`/tags/${tagId}`, {
		credentials: "include",
	});
}

export function createTag({ body, deviceId }: CreateTagVariables) {
	return apiFetch<Tag, CreateTagVariables["body"]>(`/devices/${deviceId}/tags`, {
		method: "POST",
		body,
		credentials: "include",
	});
}

export function updateTag({ body, tagId }: UpdateTagVariables) {
	return apiFetch<Tag, UpdateTagVariables["body"]>(`/tags/${tagId}`, {
		method: "PUT",
		body,
		credentials: "include",
	});
}

export function deleteTag(tagId: string) {
	return apiFetch<void>(`/tags/${tagId}`, {
		method: "DELETE",
		credentials: "include",
	});
}

function createTagListPath(filters?: TagFilters) {
	const params = new URLSearchParams();

	if (filters?.plantId) params.set("plantId", filters.plantId);
	if (filters?.deviceId) params.set("deviceId", filters.deviceId);
	if (filters?.processUnitId) {
		params.set("processUnitId", filters.processUnitId);
	}
	if (filters?.enabled !== undefined) params.set("enabled", String(filters.enabled));

	const queryString = params.toString();
	return queryString ? `/tags?${queryString}` : "/tags";
}
