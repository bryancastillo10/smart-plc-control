import type {
	CreateDeviceVariables,
	Device,
	DeviceFilters,
	UpdateDeviceVariables,
} from "@/types/device";
import { apiFetch } from "@/utils/fetch";

export const deviceQueryKeys = {
	all: ["devices"] as const,
	detail: (deviceId: string) => [...deviceQueryKeys.all, deviceId] as const,
	list: (filters?: DeviceFilters) => [...deviceQueryKeys.all, filters] as const,
};

export function listDevices(filters?: DeviceFilters) {
	return apiFetch<Device[]>(createDeviceListPath(filters), {
		credentials: "include",
	});
}

export function getDevice(deviceId: string) {
	return apiFetch<Device>(`/devices/${deviceId}`, {
		credentials: "include",
	});
}

export function createDevice(body: CreateDeviceVariables) {
	return apiFetch<Device, CreateDeviceVariables>("/devices", {
		method: "POST",
		body,
		credentials: "include",
	});
}

export function updateDevice({ body, deviceId }: UpdateDeviceVariables) {
	return apiFetch<Device, UpdateDeviceVariables["body"]>(`/devices/${deviceId}`, {
		method: "PUT",
		body,
		credentials: "include",
	});
}

export function deleteDevice(deviceId: string) {
	return apiFetch<void>(`/devices/${deviceId}`, {
		method: "DELETE",
		credentials: "include",
	});
}

export function connectDevice(deviceId: string) {
	return apiFetch<Device>(`/devices/${deviceId}/connect`, {
		method: "POST",
		credentials: "include",
	});
}

export function disconnectDevice(deviceId: string) {
	return apiFetch<Device>(`/devices/${deviceId}/disconnect`, {
		method: "POST",
		credentials: "include",
	});
}

function createDeviceListPath(filters?: DeviceFilters) {
	const params = new URLSearchParams();

	if (filters?.plantId) params.set("plantId", filters.plantId);
	if (filters?.status) params.set("status", filters.status);
	if (filters?.type) params.set("type", filters.type);
	if (filters?.protocol) params.set("protocol", filters.protocol);

	const queryString = params.toString();
	return queryString ? `/devices?${queryString}` : "/devices";
}
