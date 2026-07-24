import { useQuery } from "@tanstack/react-query";

import { deviceQueryKeys, getDevice, listDevices } from "@/features/devices/queries";
import type { DeviceFilters } from "@/types/device";

export function useDevices(filters?: DeviceFilters) {
	return useQuery({
		queryKey: deviceQueryKeys.list(filters),
		queryFn: () => listDevices(filters),
	});
}

export function useDevice(deviceId?: string) {
	return useQuery({
		enabled: Boolean(deviceId),
		queryKey: deviceQueryKeys.detail(deviceId ?? ""),
		queryFn: () => getDevice(deviceId as string),
	});
}
