import type { SimulationStatus } from "@/types/enum";

export interface SimulationStreamFilters {
	plantId: string;
	status?: SimulationStatus;
	intervalMs?: number;
}

export function createSimulationSocketUrl({
	plantId,
	status,
	intervalMs,
}: SimulationStreamFilters) {
	const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
	const url = new URL(
		"/api/v1/ws/simulation",
		`${protocol}//${window.location.host}`,
	);

	url.searchParams.set("plantId", plantId);
	if (status) url.searchParams.set("status", status);
	if (intervalMs !== undefined) {
		url.searchParams.set("intervalMs", String(intervalMs));
	}

	return url.toString();
}
