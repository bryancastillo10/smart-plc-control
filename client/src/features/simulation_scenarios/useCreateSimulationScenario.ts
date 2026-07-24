import { useMutation } from "@tanstack/react-query";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { createSimulationScenario } from "@/features/simulation_scenarios/queries";
import { useToast } from "@/integrations/sonner";
import type { CreateSimulationScenarioLocalRequest } from "@/types/simulation-scenario";

const initialScenarioData: CreateSimulationScenarioLocalRequest = {
	simulationId: "",
	name: "",
	description: "",
	enabled: true,
};

export function useCreateSimulationScenario() {
	const { t } = useTranslation("toast");
	const [scenarioData, setScenarioData] = useState(initialScenarioData);
	const toast = useToast();

	const createScenarioMutation = useMutation({
		mutationFn: (variables: CreateSimulationScenarioLocalRequest) =>
			createSimulationScenario({
				body: {
					description: variables.description,
					enabled: variables.enabled,
					name: variables.name,
				},
				simulationId: variables.simulationId,
			}),
		onMutate: () => toast.loading(t("simulationScenario.create.loading")),
		onError: (error) => {
			toast.error(error, t("simulationScenario.create.failed"));
		},
		onSettled: (_data, _error, _variables, toastId) => {
			toast.dismiss(toastId);
		},
	});

	const onChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { id, value } = event.target;

		setScenarioData((currentData) => ({
			...currentData,
			[id]: value,
		}));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	return {
		createScenario: createScenarioMutation.mutate,
		createScenarioAsync: createScenarioMutation.mutateAsync,
		createScenarioError: createScenarioMutation.error,
		createScenarioLoading: createScenarioMutation.isPending,
		createScenarioMutation,
		createScenarioResponse: createScenarioMutation.data,
		handleSubmit,
		onChange,
		scenarioData,
		setScenarioData,
	};
}

export default useCreateSimulationScenario;
