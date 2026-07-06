import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type SubmitEvent } from "react";

import { currentUser } from "@/features/auth/queries";
import { toUserProfile } from "@/features/auth/userProfile";
import { createPlant } from "@/features/plant/queries";
import type { CreatePlantRequest, CreatePlantVariables } from "@/features/plant/type";
import { useToast } from "@/integrations/sonner";
import { useUserStore } from "@/store/user";
import type { PlantStatus } from "@/types/enum";
import { getErrorMessage } from "@/utils/error";

const initialPlantData: CreatePlantRequest = {
	name: "",
	location: "",
	description: "",
	status: "ACTIVE",
};

const createPlantSuccessMessage = "A plant has been created.";
const createPlantErrorMessage = "Failed to create a plant.";
const createPlantRequiredMessage = "Enter both plant name and location.";

export function useCreatePlant() {
	const navigate = useNavigate();
	const toast = useToast();
	const setUser = useUserStore((state) => state.setUser);

	const [plantData, setPlantData] = useState<CreatePlantRequest>(initialPlantData);

	const createPlantMutation = useMutation({
		mutationFn: (variables: CreatePlantVariables) => createPlant(variables),
		onSuccess: async () => {
			try {
				const user = await currentUser();

				setUser(toUserProfile(user));
				setPlantData(initialPlantData);
				toast.success(createPlantSuccessMessage);
				await navigate({ to: "/dashboard", replace: true });
			} catch (error) {
				toast.error(getErrorMessage(error, createPlantErrorMessage));
			}
		},
		onError: (error) => {
			toast.error(getErrorMessage(error, createPlantErrorMessage));
		},
	});

	const onChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
			toast.error(null, createPlantRequiredMessage);
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