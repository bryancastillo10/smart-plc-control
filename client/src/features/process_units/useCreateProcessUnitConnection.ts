import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import {
	initialConnectionData,
	usePlantSetupFormStore,
} from "@/store/plantSetupForms";
import type { ProcessUnitPosition } from "@/types/process-unit";

export function useCreateProcessUnitConnection() {
	const { t } = useTranslation("toast");
	const connectionData = usePlantSetupFormStore(
		(state) => state.connectionData,
	);
	const setConnectionData = usePlantSetupFormStore(
		(state) => state.setConnectionData,
	);
	const plant = usePlantSetupStore((state) => state.workflowState.plant);
	const processUnits = usePlantSetupStore(
		(state) => state.workflowState.processUnits,
	);
	const devices = usePlantSetupStore((state) => state.workflowState.devices);
	const connections = usePlantSetupStore(
		(state) => state.workflowState.processUnitConnections,
	);
	const setProcessUnits = usePlantSetupStore(
		(state) => state.setProcessUnits,
	);
	const setDevices = usePlantSetupStore((state) => state.setDevices);
	const setConnections = usePlantSetupStore(
		(state) => state.setProcessUnitConnections,
	);
	const toast = useToast();

	const createConnectionMutation = useMutation({
		// mutationFn is called by the final plant setup submission workflow.
		onMutate: () =>
			toast.loading(t("processUnitConnection.create.loading")),
		onError: (error) =>
			toast.error(error, t("processUnitConnection.create.failed")),
		onSettled: (_data, _error, _variables, toastId) =>
			toast.dismiss(toastId),
	});

	const beginConnection = (sourceUnitId: string) => {
		const sourceUnit = processUnits.find((unit) => unit.id === sourceUnitId);
		setConnectionData({
			...initialConnectionData,
			sourceUnitId,
			sourcePortId:
				sourceUnit?.ports.find((port) => port.direction === "OUT")?.id ??
				"out",
		});
	};

	const cancelConnection = () => {
		setConnectionData(initialConnectionData);
	};

	const createConnection = (sourceUnitId: string, targetUnitId: string) => {
		const sourceUnit = processUnits.find((unit) => unit.id === sourceUnitId);
		const targetUnit = processUnits.find((unit) => unit.id === targetUnitId);
		const alreadyExists = connections.some(
			(connection) =>
				connection.sourceUnitId === sourceUnitId &&
				connection.targetUnitId === targetUnitId,
		);

		if (
			!plant ||
			!sourceUnit ||
			!targetUnit ||
			sourceUnitId === targetUnitId ||
			alreadyExists
		) {
			cancelConnection();
			return false;
		}

		const sourcePortId =
			sourceUnit.ports.find((port) => port.direction === "OUT")?.id ?? "out";
		const targetPortId =
			targetUnit.ports.find((port) => port.direction === "IN")?.id ?? "in";

		setConnections([
			...connections,
			{
				...connectionData,
				id: `connection-${crypto.randomUUID()}`,
				plantId: plant.id,
				sourceUnitId,
				sourcePortId,
				targetUnitId,
				targetPortId,
			},
		]);
		cancelConnection();
		return true;
	};

	const removeConnection = (id: string) => {
		setConnections(connections.filter((connection) => connection.id !== id));
	};

	const moveProcessUnit = (id: string, position: ProcessUnitPosition) => {
		setProcessUnits(
			processUnits.map((unit) =>
				unit.id === id ? { ...unit, position } : unit,
			),
		);
	};

	const moveDevice = (id: string, position: ProcessUnitPosition) => {
		setDevices(
			devices.map((device) =>
				device.id === id ? { ...device, position } : device,
			),
		);
	};

	return {
		beginConnection,
		cancelConnection,
		connectionData,
		connections,
		createConnection,
		createConnectionLoading: createConnectionMutation.isPending,
		createConnectionMutation,
		devices,
		moveDevice,
		moveProcessUnit,
		processUnits,
		removeConnection,
	};
}

export default useCreateProcessUnitConnection;
