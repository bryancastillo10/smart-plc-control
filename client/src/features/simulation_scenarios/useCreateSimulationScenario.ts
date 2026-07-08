import { useMutation } from "@tanstack/react-query";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
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
	const [createScenarioLoading, setCreateScenarioLoading] =
		useState<boolean>(false);
	const toast = useToast();

	const createScenarioMutation = useMutation({
		// mutationFn: () => {},
		onMutate: () => toast.loading(t("simulationScenario.create.loading")),
		onSuccess: async () => {
			setCreateScenarioLoading(false);
		},
		onError: (error) => {
			setCreateScenarioLoading(false);
			toast.error(error, t("simulationScenario.create.failed"));
		},
		onSettled: (_data, _error, _variables, toastId) => {
			toast.dismiss(toastId);
		},
	});

	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id , value } = event.target;

		setScenarioData((currentData) => ({
			...currentData,
			[id]: value,
		}));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		// API call would be here
	};

	return {
		scenarioData,
		createScenarioLoading,
		createScenarioMutation,
		setScenarioData,
		onChange,
		handleSubmit,
	};
}

export default useCreateSimulationScenario;