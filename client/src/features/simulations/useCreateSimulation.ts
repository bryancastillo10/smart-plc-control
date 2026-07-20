import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { createSimulation } from "@/features/simulations/queries";
import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import {
	initialSimulationData,
	usePlantSetupFormStore,
} from "@/store/plantSetupForms";
import type { CreateSimulationLocalVariables } from "@/types/simulation";

const numericSimulationFields = new Set(["updateIntervalMs", "noiseFactor"]);

export function useCreateSimulation() {
	const { t } = useTranslation("toast");
	const simulationData = usePlantSetupFormStore(
		(state) => state.simulationData,
	);
	const setSimulationData = usePlantSetupFormStore(
		(state) => state.setSimulationData,
	);
	const plant = usePlantSetupStore((state) => state.workflowState.plant);
	const devices = usePlantSetupStore((state) => state.workflowState.devices);
	const simulations = usePlantSetupStore(
		(state) => state.workflowState.simulations,
	);
	const setSimulations = usePlantSetupStore((state) => state.setSimulations);
	const simulatorDevices = devices.filter(
		(device) => device.type === "SIMULATOR",
	);
	const toast = useToast();

	const createSimulationMutation = useMutation({
		mutationFn: (variables: CreateSimulationLocalVariables) =>
			createSimulation(variables),
		onMutate: () => toast.loading(t("simulation.create.loading")),
		onError: (error) => toast.error(error, t("simulation.create.failed")),
		onSettled: (_data, _error, _variables, toastId) =>
			toast.dismiss(toastId),
	});

	const onChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { id, value } = event.target;
		setSimulationData((current) => ({
			...current,
			[id]: numericSimulationFields.has(id)
				? value === ""
					? undefined
					: Number(value)
				: value,
		}));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const name = simulationData.name.trim();
		const updateIntervalMs = simulationData.updateIntervalMs ?? 1000;
		const noiseFactor = simulationData.noiseFactor ?? 0;
		const duplicateSimulation = simulations.some(
			(simulation) =>
				simulation.name.toLocaleLowerCase() === name.toLocaleLowerCase(),
		);

		if (
			!plant ||
			simulatorDevices.length === 0 ||
			!name ||
			updateIntervalMs < 100 ||
			noiseFactor < 0 ||
			noiseFactor > 1 ||
			duplicateSimulation
		) {
			toast.error(null, t("simulation.create.failed"));
			return;
		}

		const now = new Date().toISOString();
		setSimulations([
			...simulations,
			{
				...simulationData,
				id: `simulation-${crypto.randomUUID()}`,
				plantId: plant.id,
				name,
				status: "IDLE",
				updateIntervalMs,
				noiseFactor,
				createdAt: now,
				updatedAt: now,
			},
		]);
		setSimulationData({
			...initialSimulationData,
			plantId: plant.id,
		});
	};

	const removeSimulation = (id: string) => {
		setSimulations(
			simulations.filter((simulation) => simulation.id !== id),
		);
	};

	return {
		createSimulation: createSimulationMutation.mutate,
		createSimulationAsync: createSimulationMutation.mutateAsync,
		createSimulationError: createSimulationMutation.error,
		createSimulationLoading: createSimulationMutation.isPending,
		createSimulationMutation,
		createSimulationResponse: createSimulationMutation.data,
		handleSubmit,
		hasSimulatorDevice: simulatorDevices.length > 0,
		onChange,
		plantExists: plant !== null,
		removeSimulation,
		setSimulationData,
		simulationData,
		simulations,
		simulatorDevices,
	};
}

export default useCreateSimulation;
