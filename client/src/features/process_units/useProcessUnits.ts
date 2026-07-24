import { useQuery } from "@tanstack/react-query";

import {
	getProcessUnit,
	getProcessUnitConnection,
	listProcessUnitConnections,
	listProcessUnits,
	processUnitConnectionQueryKeys,
	processUnitQueryKeys,
} from "@/features/process_units/queries";

export function useProcessUnits(plantId?: string) {
	return useQuery({
		enabled: Boolean(plantId),
		queryKey: processUnitQueryKeys.byPlant(plantId ?? ""),
		queryFn: () => listProcessUnits(plantId as string),
	});
}

export function useProcessUnit(processUnitId?: string) {
	return useQuery({
		enabled: Boolean(processUnitId),
		queryKey: processUnitQueryKeys.detail(processUnitId ?? ""),
		queryFn: () => getProcessUnit(processUnitId as string),
	});
}

export function useProcessUnitConnections(plantId?: string) {
	return useQuery({
		enabled: Boolean(plantId),
		queryKey: processUnitConnectionQueryKeys.byPlant(plantId ?? ""),
		queryFn: () => listProcessUnitConnections(plantId as string),
	});
}

export function useProcessUnitConnection(connectionId?: string) {
	return useQuery({
		enabled: Boolean(connectionId),
		queryKey: processUnitConnectionQueryKeys.detail(connectionId ?? ""),
		queryFn: () => getProcessUnitConnection(connectionId as string),
	});
}
