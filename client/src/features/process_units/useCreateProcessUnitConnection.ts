import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import { initialConnectionData, usePlantSetupFormStore } from "@/store/plantSetupForms";

export function useCreateProcessUnitConnection() {
	const { t } = useTranslation("toast");
	const connectionData = usePlantSetupFormStore((state) => state.connectionData);
	const setConnectionData = usePlantSetupFormStore((state) => state.setConnectionData);
	const connections = usePlantSetupStore((state) => state.workflowState.processUnitConnections);
	const setConnections = usePlantSetupStore((state) => state.setProcessUnitConnections);
	const toast = useToast();
	const createConnectionMutation = useMutation({
		// mutationFn is called by the final plant setup submission workflow.
		onMutate: () => toast.loading(t("processUnitConnection.create.loading")),
		onError: (error) => toast.error(error, t("processUnitConnection.create.failed")),
		onSettled: (_data, _error, _variables, toastId) => toast.dismiss(toastId),
	});
	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id, value } = event.target;
		setConnectionData((current) => ({ ...current, [id]: value }));
	};
	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		setConnections([...connections, { ...connectionData, id: `connection-${crypto.randomUUID()}` }]);
		setConnectionData(initialConnectionData);
	};
	return { connectionData, createConnectionLoading: createConnectionMutation.isPending, createConnectionMutation, setConnectionData, onChange, handleSubmit };
}

export default useCreateProcessUnitConnection;
