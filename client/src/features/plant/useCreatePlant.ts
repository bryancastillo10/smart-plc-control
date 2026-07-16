import { useMutation } from "@tanstack/react-query";
import { type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { createPlant } from "@/features/plant/queries";
import type { CreatePlantVariables } from "@/features/plant/type";
import { useToast } from "@/integrations/sonner";
import { usePlantSetupStore } from "@/store/plantSetup";
import { usePlantSetupFormStore } from "@/store/plantSetupForms";
import type { PlantStatus } from "@/types/enum";

export function useCreatePlant() {
	const { t } = useTranslation("toast");
	const toast = useToast();
	const plantData = usePlantSetupFormStore((state) => state.plantData);
	const setPlantData = usePlantSetupFormStore((state) => state.setPlantData);
	const setPlant = usePlantSetupStore((state) => state.setPlant);

	const createPlantMutation = useMutation({
		mutationFn: (variables: CreatePlantVariables) => createPlant(variables),
		onMutate: () => toast.loading(t("plant.create.loading")),
		onError: (error) => toast.error(error, t("plant.create.failed")),
		onSettled: (_data, _error, _variables, toastId) => toast.dismiss(toastId),
	});

	const onChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { id, value } = event.target;
		setPlantData((current) => ({ ...current, [id]: id === "status" ? (value as PlantStatus) : value }));
	};
	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!plantData.name.trim() || !plantData.location.trim()) {
			toast.error(null, t("plant.create.required"));
			return;
		}
		setPlant({ ...plantData, name: plantData.name.trim(), location: plantData.location.trim(), description: plantData.description?.trim(), status: plantData.status ?? "ACTIVE", accessibleBy: [] });
	};
	return { plantData, setPlantData, onChange, handleSubmit, createPlant: createPlantMutation.mutate, createPlantAsync: createPlantMutation.mutateAsync, createPlantLoading: createPlantMutation.isPending, createPlantResponse: createPlantMutation.data, createPlantError: createPlantMutation.error };
}

export default useCreatePlant;
