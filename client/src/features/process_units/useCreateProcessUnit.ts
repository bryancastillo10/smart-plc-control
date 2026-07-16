import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import { initialProcessUnitData, usePlantSetupFormStore } from "@/store/plantSetupForms";

export function useCreateProcessUnit() {
	const { t } = useTranslation("toast");
	const processUnitData = usePlantSetupFormStore((state) => state.processUnitData);
	const setProcessUnitData = usePlantSetupFormStore((state) => state.setProcessUnitData);
	const processUnits = usePlantSetupStore((state) => state.workflowState.processUnits);
	const setProcessUnits = usePlantSetupStore((state) => state.setProcessUnits);
	const toast = useToast();
	const createProcessUnitMutation = useMutation({
		// mutationFn is called by the final plant setup submission workflow.
		onMutate: () => toast.loading(t("processUnit.create.loading")),
		onError: (error) => toast.error(error, t("processUnit.create.failed")),
		onSettled: (_data, _error, _variables, toastId) => toast.dismiss(toastId),
	});
	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { id, value } = event.target;
		setProcessUnitData((current) => ({ ...current, [id]: value }));
	};
	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		setProcessUnits([...processUnits, { ...processUnitData, id: `process-unit-${crypto.randomUUID()}` }]);
		setProcessUnitData(initialProcessUnitData);
	};
	return { processUnitData, createProcessUnitLoading: createProcessUnitMutation.isPending, createProcessUnitMutation, setProcessUnitData, onChange, handleSubmit };
}

export default useCreateProcessUnit;
