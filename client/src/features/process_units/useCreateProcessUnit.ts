import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { createProcessUnit } from "@/features/process_units/queries";

import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import {
	initialProcessUnitData,
	usePlantSetupFormStore,
} from "@/store/plantSetupForms";

export function useCreateProcessUnit() {
	const { t } = useTranslation("toast");
	const processUnitData = usePlantSetupFormStore(
		(state) => state.processUnitData,
	);
	const setProcessUnitData = usePlantSetupFormStore(
		(state) => state.setProcessUnitData,
	);
	const plant = usePlantSetupStore((state) => state.workflowState.plant);
	const processUnits = usePlantSetupStore(
		(state) => state.workflowState.processUnits,
	);
	const setProcessUnits = usePlantSetupStore(
		(state) => state.setProcessUnits,
	);
	const toast = useToast();

	const createProcessUnitMutation = useMutation({
		mutationFn: createProcessUnit,
		onMutate: () => toast.loading(t("processUnit.create.loading")),
		onError: (error) =>
			toast.error(error, t("processUnit.create.failed")),
		onSettled: (_data, _error, _variables, toastId) =>
			toast.dismiss(toastId),
	});

	const onChange = (
		event: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { id, value } = event.target;
		setProcessUnitData((current) => ({ ...current, [id]: value }));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!plant || !processUnitData.name.trim() || !processUnitData.type.trim()) {
			toast.error(null, t("processUnit.create.failed"));
			return;
		}

		setProcessUnits([
			...processUnits,
			{
				...processUnitData,
				id: `process-unit-${crypto.randomUUID()}`,
				plantId: plant.id,
				position: {
					x: 32 + (processUnits.length % 4) * 180,
					y: 32 + Math.floor(processUnits.length / 4) * 108,
				},
				name: processUnitData.name.trim(),
				type: processUnitData.type.trim(),
				description: processUnitData.description?.trim(),
			},
		]);
		setProcessUnitData(initialProcessUnitData);
	};

	const removeProcessUnit = (id: string) => {
		setProcessUnits(processUnits.filter((unit) => unit.id !== id));
	};

	return {
		processUnitData,
		processUnits,
		plantExists: plant !== null,
		createProcessUnitLoading: createProcessUnitMutation.isPending,
		createProcessUnit: createProcessUnitMutation.mutate,
		createProcessUnitResponse: createProcessUnitMutation.data,
		createProcessUnitError: createProcessUnitMutation.error,
		createProcessUnitAsync: createProcessUnitMutation.mutateAsync,
		createProcessUnitMutation,
		setProcessUnitData,
		onChange,
		handleSubmit,
		removeProcessUnit,
	};
}

export default useCreateProcessUnit;
