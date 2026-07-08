import { useMutation } from "@tanstack/react-query";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/integrations/sonner";
import type { CreateSimulationLocalRequest } from "@/types/simulation";

const initialSimulationData: CreateSimulationLocalRequest = {
	deviceId: "",
	name: "",
	description: "",
	status: "IDLE",
};

export function useCreateSimulation() {
	const { t } = useTranslation("toast");
	const [simulationData, setSimulationData] = useState(initialSimulationData);
	const [createSimulationLoading, setCreateSimulationLoading] =
		useState<boolean>(false);
	const toast = useToast();

	const createSimulationMutation = useMutation({
		// mutationFn: () => {},
		onMutate: () => toast.loading(t("simulation.create.loading")),
		onSuccess: async () => {
			setCreateSimulationLoading(false);
		},
		onError: (error) => {
			setCreateSimulationLoading(false);
			toast.error(error, t("simulation.create.failed"));
		},
		onSettled: (_data, _error, _variables, toastId) => {
			toast.dismiss(toastId);
		},
	});


	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id , value } = event.target;

		setSimulationData((currentData) => ({
			...currentData,
			[id]: value,
		}));
	};
	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		// API call would be here
	};

	return {
		simulationData,
		createSimulationLoading,
		createSimulationMutation,
		setSimulationData,
		onChange,
		handleSubmit,
	};
}

export default useCreateSimulation;