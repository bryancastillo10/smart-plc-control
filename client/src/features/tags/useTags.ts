import { useQuery } from "@tanstack/react-query";

import {
	getTag,
	listDeviceTags,
	listProcessUnitTags,
	listTags,
	tagQueryKeys,
} from "@/features/tags/queries";
import type { TagFilters } from "@/types/tag";

export function useTags(filters?: TagFilters) {
	return useQuery({
		queryKey: tagQueryKeys.list(filters),
		queryFn: () => listTags(filters),
	});
}

export function useDeviceTags(deviceId?: string) {
	return useQuery({
		enabled: Boolean(deviceId),
		queryKey: tagQueryKeys.byDevice(deviceId ?? ""),
		queryFn: () => listDeviceTags(deviceId as string),
	});
}

export function useProcessUnitTags(processUnitId?: string) {
	return useQuery({
		enabled: Boolean(processUnitId),
		queryKey: tagQueryKeys.byProcessUnit(processUnitId ?? ""),
		queryFn: () => listProcessUnitTags(processUnitId as string),
	});
}

export function useTag(tagId?: string) {
	return useQuery({
		enabled: Boolean(tagId),
		queryKey: tagQueryKeys.detail(tagId ?? ""),
		queryFn: () => getTag(tagId as string),
	});
}
