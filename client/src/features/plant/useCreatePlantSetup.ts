import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
	createAlertRuleRequest,
	useCreateAlertRule,
} from "@/features/alert_rules/useCreateAlertRule";
import { useCreateDevice } from "@/features/devices/useCreateDevice";
import { useCreatePlant } from "@/features/plant/useCreatePlant";
import { useCreateProcessUnit } from "@/features/process_units/useCreateProcessUnit";
import { useCreateProcessUnitConnection } from "@/features/process_units/useCreateProcessUnitConnection";
import { useCreateSimulation } from "@/features/simulations/useCreateSimulation";
import { useCreateTag } from "@/features/tags/useCreateTag";
import { useModalStore } from "@/store/modal";
import { usePlantSetupFormStore } from "@/store/plantSetupForms";

export type PlantSetupRequestStatus =
	| "pending"
	| "success"
	| "failed"
	| "skipped";

export interface PlantSetupRequestState {
	completed: number;
	error?: string;
	loading: boolean;
	status: PlantSetupRequestStatus;
	total: number;
}

export const plantSetupRequests = [
	{ id: "plant", label: "Plant information" },
	{ id: "processUnits", label: "Process units" },
	{ id: "devices", label: "Devices" },
	{ id: "connections", label: "Process connections" },
	{ id: "tags", label: "Tags" },
	{ id: "alertRules", label: "Alert rules" },
	{ id: "simulations", label: "Simulations" },
] as const;

export type PlantSetupRequestId = (typeof plantSetupRequests)[number]["id"];

const initialRequests = Object.fromEntries(
	plantSetupRequests.map(({ id }) => [
		id,
		{ completed: 0, loading: false, status: "pending", total: 0 },
	]),
) as Record<PlantSetupRequestId, PlantSetupRequestState>;

export function useCreatePlantSetup() {
	const plantData = usePlantSetupFormStore((state) => state.plantData);
	const { createPlantAsync, createPlantLoading } = useCreatePlant();
	const { createProcessUnitAsync, createProcessUnitLoading, processUnits } =
		useCreateProcessUnit();
	const { createConnectionAsync, createConnectionLoading, connections } =
		useCreateProcessUnitConnection();
	const { createDeviceAsync, createDeviceLoading, devices } = useCreateDevice();
	const { createTagAsync, createTagLoading, tags } = useCreateTag();
	const { alertRules, createAlertRuleAsync, createAlertRuleLoading } =
		useCreateAlertRule();
	const { createSimulationAsync, createSimulationLoading, simulations } =
		useCreateSimulation();
	const closeModal = useModalStore((state) => state.closeModal);
	const navigate = useNavigate();
	const started = useRef(false);
	const [requests, setRequests] = useState(initialRequests);

	useEffect(() => {
		if (started.current) return;
		started.current = true;
		let mounted = true;
		const update = (
			id: PlantSetupRequestId,
			value: Partial<PlantSetupRequestState>,
		) => {
			if (!mounted) return;
			setRequests((current) => ({
				...current,
				[id]: { ...current[id], ...value },
			}));
		};

		const execute = async () => {
			const unitIds = new Map<string, string>();
			const deviceIds = new Map<string, string>();
			const tagIds = new Map<string, string>();
			const tagsById = new Map(tags.map((tag) => [tag.id, tag]));
			let active: PlantSetupRequestId = "plant";
			const runGroup = async <T>(
				id: PlantSetupRequestId,
				items: readonly T[],
				request: (item: T) => Promise<void>,
			) => {
				active = id;
				update(id, { total: items.length });
				for (const [index, item] of items.entries()) {
					await request(item);
					update(id, { completed: index + 1 });
				}
				update(id, { status: "success" });
			};

			try {
				update("plant", { total: 1 });
				const plant = await createPlantAsync(plantData);
				update("plant", { completed: 1, status: "success" });

				await runGroup("processUnits", processUnits, async (unit) => {
					const response = await createProcessUnitAsync({
						plantId: plant.id,
						body: omit(unit, ["id", "plantId"] as const),
					});
					if (!response.processUnit) {
						throw new Error(
							`No ID was returned for process unit ${unit.name}.`,
						);
					}
					unitIds.set(unit.id, response.processUnit.id);
				});
				await runGroup("devices", devices, async (device) => {
					const response = await createDeviceAsync({
						...omit(device, ["id", "lastConnectedAt"] as const),
						plantId: plant.id,
					});
					deviceIds.set(device.id, response.id);
				});
				await runGroup("connections", connections, async (connection) => {
					await createConnectionAsync({
						plantId: plant.id,
						body: {
							...omit(connection, ["id", "plantId"] as const),
							sourceUnitId: getId(
								unitIds,
								connection.sourceUnitId,
								"process unit",
							),
							targetUnitId: getId(
								unitIds,
								connection.targetUnitId,
								"process unit",
							),
						},
					});
				});
				await runGroup("tags", tags, async (tag) => {
					const deviceId = getId(deviceIds, tag.deviceId, "device");
					const response = await createTagAsync({
						deviceId,
						body: {
							...omit(tag, ["id", "plantId"] as const),
							deviceId,
							processUnitId: tag.processUnitId
								? getId(unitIds, tag.processUnitId, "process unit")
								: undefined,
						},
					});
					if (!response.id) {
						throw new Error(`No ID was returned for tag ${tag.name}.`);
					}
					tagIds.set(tag.id, response.id);
				});

				const unresolvedRule = alertRules.find(
					(rule) => !tagIds.has(rule.tagId) || !tagsById.has(rule.tagId),
				);
				if (unresolvedRule) {
					throw new Error(
						"Tag creation did not produce the ID required by alert rule " +
							unresolvedRule.name +
							".",
					);
				}

				await runGroup("alertRules", alertRules, async (rule) => {
					const tag = tagsById.get(rule.tagId);
					if (!tag) {
						throw new Error(`Could not resolve the tag for ${rule.name}.`);
					}
					await createAlertRuleAsync(
						createAlertRuleRequest(
							rule,
							getId(tagIds, rule.tagId, "tag"),
							tag.dataType,
						),
					);
				});
				await runGroup("simulations", simulations, async (simulation) => {
					await createSimulationAsync({
						...omit(simulation, [
							"id",
							"createdAt",
							"updatedAt",
							"startedAt",
							"pausedAt",
							"stoppedAt",
						] as const),
						plantId: plant.id,
					});
				});
				toast.success("Plant Set up is complete");
				closeModal();
				void navigate({ to: "/", replace: true });
			} catch (error) {
				update(active, {
					error:
						error instanceof Error ? error.message : "Unexpected API error.",
					status: "failed",
				});
				const failedAt = plantSetupRequests.findIndex(
					({ id }) => id === active,
				);
				for (const { id } of plantSetupRequests.slice(failedAt + 1)) {
					update(id, { status: "skipped" });
				}
			}
		};

		void execute();
		return () => {
			mounted = false;
		};
	}, [
		alertRules,
		connections,
		createAlertRuleAsync,
		createConnectionAsync,
		createDeviceAsync,
		createPlantAsync,
		createProcessUnitAsync,
		createSimulationAsync,
		createTagAsync,
		devices,
		plantData,
		processUnits,
		simulations,
		tags,
		closeModal,
		navigate,
	]);

	return {
		...requests,
		plant: { ...requests.plant, loading: createPlantLoading },
		processUnits: {
			...requests.processUnits,
			loading: createProcessUnitLoading,
		},
		devices: { ...requests.devices, loading: createDeviceLoading },
		connections: {
			...requests.connections,
			loading: createConnectionLoading,
		},
		tags: { ...requests.tags, loading: createTagLoading },
		alertRules: {
			...requests.alertRules,
			loading: createAlertRuleLoading,
		},
		simulations: {
			...requests.simulations,
			loading: createSimulationLoading,
		},
	};
}

function getId(ids: Map<string, string>, localId: string, label: string) {
	const id = ids.get(localId);
	if (!id) throw new Error(`Could not resolve the created ${label}.`);
	return id;
}

function omit<T extends object, K extends keyof T>(
	value: T,
	keys: readonly K[],
) {
	const excluded = new Set<PropertyKey>(keys);
	return Object.fromEntries(
		Object.entries(value).filter(([key]) => !excluded.has(key)),
	) as Omit<T, K>;
}
