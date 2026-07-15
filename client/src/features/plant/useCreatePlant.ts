import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

import { currentUser } from "@/features/auth/queries";
import { toUserProfile } from "@/features/auth/userProfile";
import { createPlant } from "@/features/plant/queries";
import type { CreatePlantRequest, CreatePlantVariables } from "@/features/plant/type";
import { useToast } from "@/integrations/sonner";
import { useUserStore } from "@/store/user";
import type { PlantStatus } from "@/types/enum";

const initialPlantData: CreatePlantRequest = {
	name: "",
	location: "",
	description: "",
	status: "ACTIVE",
};

export function useCreatePlant() {
	const { t } = useTranslation("toast");
	const navigate = useNavigate();
	const toast = useToast();
	const setUser = useUserStore((state) => state.setUser);

	const [plantData, setPlantData] = useState<CreatePlantRequest>(initialPlantData);

	const createPlantMutation = useMutation({
		mutationFn: (variables: CreatePlantVariables) => createPlant(variables),
		onMutate: () => toast.loading(t("plant.create.loading")),
		onSuccess: async () => {
			try {
				const user = await currentUser();

				setUser(toUserProfile(user));
				setPlantData(initialPlantData);
				toast.success(t("plant.create.success"));
				await navigate({ to: "/dashboard", replace: true });
			} catch (error) {
				toast.error(error, t("plant.create.failed"));
			}
		},
		onError: (error) => {
			toast.error(error, t("plant.create.failed"));
		},
		onSettled: (_data, _error, _variables, toastId) => {
			toast.dismiss(toastId);
		},
	});

	const onChange = (
		event: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => {
		const { id, value } = event.target;

		setPlantData((currentData) => ({
			...currentData,
			[id]: id === "status" ? (value as PlantStatus) : value,
		}));
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!plantData.name.trim() || !plantData.location.trim()) {
			toast.error(null, t("plant.create.required"));
			return;
		}

		createPlantMutation.mutate({
			...plantData,
			name: plantData.name.trim(),
			location: plantData.location.trim(),
			description: plantData.description?.trim(),
		});
	};

	return {
		plantData,
		setPlantData,
		onChange,
		handleSubmit,
		createPlant: createPlantMutation.mutate,
		createPlantAsync: createPlantMutation.mutateAsync,
		createPlantLoading: createPlantMutation.isPending,
		createPlantResponse: createPlantMutation.data,
		createPlantError: createPlantMutation.error,
	};
}

export default useCreatePlant;
