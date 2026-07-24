import type {
	CreateProcessUnitConnectionVariables,
	ProcessUnitConnection,
	UpdateProcessUnitConnectionVariables,
} from "@/types/process-unit-connection";
import type {
	CreateProcessUnitVariables,
	ProcessUnit,
	ProcessUnitMutationResponse,
	UpdateProcessUnitVariables,
} from "@/types/process-unit";
import { apiFetch } from "@/utils/fetch";

export const processUnitQueryKeys = {
	all: ["process-units"] as const,
	byPlant: (plantId: string) => [...processUnitQueryKeys.all, "plant", plantId] as const,
	detail: (processUnitId: string) =>
		[...processUnitQueryKeys.all, processUnitId] as const,
};

export const processUnitConnectionQueryKeys = {
	all: ["process-unit-connections"] as const,
	byPlant: (plantId: string) =>
		[...processUnitConnectionQueryKeys.all, "plant", plantId] as const,
	detail: (connectionId: string) =>
		[...processUnitConnectionQueryKeys.all, connectionId] as const,
};

export function listProcessUnits(plantId: string) {
	return apiFetch<ProcessUnit[]>(`/plants/${plantId}/process-units`, {
		credentials: "include",
	});
}

export function getProcessUnit(processUnitId: string) {
	return apiFetch<ProcessUnit>(`/process-units/${processUnitId}`, {
		credentials: "include",
	});
}

export function createProcessUnit({ body, plantId }: CreateProcessUnitVariables) {
	return apiFetch<ProcessUnitMutationResponse, CreateProcessUnitVariables["body"]>(
		`/plants/${plantId}/process-units`,
		{
			method: "POST",
			body,
			credentials: "include",
		},
	);
}

export function updateProcessUnit({
	body,
	processUnitId,
}: UpdateProcessUnitVariables) {
	return apiFetch<ProcessUnitMutationResponse, UpdateProcessUnitVariables["body"]>(
		`/process-units/${processUnitId}`,
		{
			method: "PUT",
			body,
			credentials: "include",
		},
	);
}

export function deleteProcessUnit(processUnitId: string) {
	return apiFetch<ProcessUnitMutationResponse>(`/process-units/${processUnitId}`, {
		method: "DELETE",
		credentials: "include",
	});
}

export function listProcessUnitConnections(plantId: string) {
	return apiFetch<ProcessUnitConnection[]>(
		`/plants/${plantId}/process-unit-connections`,
		{ credentials: "include" },
	);
}

export function getProcessUnitConnection(connectionId: string) {
	return apiFetch<ProcessUnitConnection>(
		`/process-unit-connections/${connectionId}`,
		{ credentials: "include" },
	);
}

export function createProcessUnitConnection({
	body,
	plantId,
}: CreateProcessUnitConnectionVariables) {
	return apiFetch<
		ProcessUnitConnection,
		CreateProcessUnitConnectionVariables["body"]
	>(`/plants/${plantId}/process-unit-connections`, {
		method: "POST",
		body,
		credentials: "include",
	});
}

export function updateProcessUnitConnection({
	body,
	connectionId,
}: UpdateProcessUnitConnectionVariables) {
	return apiFetch<
		ProcessUnitConnection,
		UpdateProcessUnitConnectionVariables["body"]
	>(`/process-unit-connections/${connectionId}`, {
		method: "PUT",
		body,
		credentials: "include",
	});
}

export function deleteProcessUnitConnection(connectionId: string) {
	return apiFetch<void>(`/process-unit-connections/${connectionId}`, {
		method: "DELETE",
		credentials: "include",
	});
}
