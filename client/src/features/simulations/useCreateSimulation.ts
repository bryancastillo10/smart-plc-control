import { useMutation } from "@tanstack/react-query";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { createSimulation } from "@/features/simulations/queries";
import { useToast } from "@/integrations/sonner";
import type {
	CreateSimulationLocalRequest,
	CreateSimulationLocalVariables,
} from "@/types/simulation";

const initialSimulationData: CreateSimulationLocalRequest = {
	plantId: "",
	name: "",
	status: "IDLE",
	updateIntervalMs: 1000,
	noiseFactor: 0,
};

export function useCreateSimulation() {
	const { t } = useTranslation("toast");
	const [simulationData, setSimulationData] = useState(initialSimulationData);
	const toast = useToast();

	const createSimulationMutation = useMutation({
		mutationFn: (variables: CreateSimulationLocalVariables) =>
			createSimulation(variables),
		onMutate: () => toast.loading(t("simulation.create.loading")),
		onSuccess: async () => {
			setSimulationData(initialSimulationData);
			toast.success(t("simulation.create.success"));
		},
		onError: (error) => {
			toast.error(error, t("simulation.create.failed"));
		},
		onSettled: (_data, _error, _variables, toastId) => {
			toast.dismiss(toastId);
		},
	});

	const onChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { id, value } = event.target;

		setSimulationData((currentData) => ({
			...currentData,
			[id]: numericSimulationFields.has(id) ? Number(value) : value,
		}));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!simulationData.plantId.trim() || !simulationData.name.trim()) {
			toast.error(null, t("simulation.create.failed"));
			return;
		}

		createSimulationMutation.mutate({
			...simulationData,
			plantId: simulationData.plantId.trim(),
			name: simulationData.name.trim(),
		});
	};

	return {
		simulationData,
		createSimulationLoading: createSimulationMutation.isPending,
		createSimulationMutation,
		setSimulationData,
		onChange,
		handleSubmit,
		createSimulation: createSimulationMutation.mutate,
		createSimulationAsync: createSimulationMutation.mutateAsync,
		createSimulationResponse: createSimulationMutation.data,
		createSimulationError: createSimulationMutation.error,
	};
}

const numericSimulationFields = new Set(["updateIntervalMs", "noiseFactor"]);

export default useCreateSimulation;
