import { useMutation } from "@tanstack/react-query";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/integrations/sonner";
import type { CreateProcessUnitConnectionLocalRequest } from "@/types/process-unit-connection";

const initialConnectionData: CreateProcessUnitConnectionLocalRequest = {
	sourceUnitId: "",
	sourcePortId: "out",
	targetUnitId: "",
	targetPortId: "in",
	label: "",
	flowType: "WASTEWATER",
};

export function useCreateProcessUnitConnection() {
	const { t } = useTranslation("toast");
	const [connectionData, setConnectionData] = useState(initialConnectionData);
	const [createConnectionLoading, setCreateConnectionLoading] =
		useState<boolean>(false);
	const toast = useToast();

	const createConnectionMutation = useMutation({
		// mutationFn: () => {},
		onMutate: () => toast.loading(t("processUnitConnection.create.loading")),
		onSuccess: async () => {
			setCreateConnectionLoading(false);
		},
		onError: (error) => {
			setCreateConnectionLoading(false);
			toast.error(error, t("processUnitConnection.create.failed"));
		},
		onSettled: (_data, _error, _variables, toastId) => {
			toast.dismiss(toastId);
		},
	});

	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id , value } = event.target;

		setConnectionData((currentData) => ({
			...currentData,
			[id]: value,
		}));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		// API call would be here
	};

	return {
		connectionData,
		createConnectionLoading,
		createConnectionMutation,
		setConnectionData,
		onChange,
		handleSubmit,
	};
}

export default useCreateProcessUnitConnection;