import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { createSimulation } from "@/features/simulations/queries";
import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import { initialSimulationData, usePlantSetupFormStore } from "@/store/plantSetupForms";
import type { CreateSimulationLocalVariables } from "@/types/simulation";

export function useCreateSimulation() {
	const { t } = useTranslation("toast");
	const simulationData = usePlantSetupFormStore((state) => state.simulationData);
	const setSimulationData = usePlantSetupFormStore((state) => state.setSimulationData);
	const simulations = usePlantSetupStore((state) => state.workflowState.simulations);
	const setSimulations = usePlantSetupStore((state) => state.setSimulations);
	const toast = useToast();
	const createSimulationMutation = useMutation({
		mutationFn: (variables: CreateSimulationLocalVariables) => createSimulation(variables),
		onMutate: () => toast.loading(t("simulation.create.loading")),
		onError: (error) => toast.error(error, t("simulation.create.failed")),
		onSettled: (_data, _error, _variables, toastId) => toast.dismiss(toastId),
	});
	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id, value } = event.target;
		setSimulationData((current) => ({ ...current, [id]: numericSimulationFields.has(id) ? Number(value) : value }));
	};
	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!simulationData.plantId.trim() || !simulationData.name.trim()) {
			toast.error(null, t("simulation.create.failed"));
			return;
		}
		const now = new Date().toISOString();
		setSimulations([...simulations, { ...simulationData, id: `simulation-${crypto.randomUUID()}`, name: simulationData.name.trim(), plantId: simulationData.plantId.trim(), status: simulationData.status ?? "IDLE", updateIntervalMs: simulationData.updateIntervalMs ?? 1000, noiseFactor: simulationData.noiseFactor ?? 0, createdAt: now, updatedAt: now }]);
		setSimulationData(initialSimulationData);
	};
	return { simulationData, createSimulationLoading: createSimulationMutation.isPending, createSimulationMutation, setSimulationData, onChange, handleSubmit, createSimulation: createSimulationMutation.mutate, createSimulationAsync: createSimulationMutation.mutateAsync, createSimulationResponse: createSimulationMutation.data, createSimulationError: createSimulationMutation.error };
}
const numericSimulationFields = new Set(["updateIntervalMs", "noiseFactor"]);
export default useCreateSimulation;
