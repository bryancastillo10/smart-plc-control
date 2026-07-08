import { useState, type ChangeEvent, type SubmitEvent } from "react";

import {
	createLocalEntityId,
	getLocalCreateFieldValue,
	type LocalCreateFieldElement,
} from "@/features/plant-setup/hooks/localCreateForm";
import type {
	CreatePlantLocalRequest,
	CreatePlantLocalVariables,
	Plant,
} from "@/types/plant";

const initialLocalPlantData: CreatePlantLocalRequest = {
	name: "",
	location: "",
	description: "",
	status: "ACTIVE",
	accessibleBy: [],
};

async function createLocalPlantPlaceholder(
	variables: CreatePlantLocalVariables,
): Promise<Plant> {
	return Promise.resolve({
		id: createLocalEntityId("plant"),
		accessibleBy: variables.accessibleBy ?? [],
		...variables,
	});
}

export function useCreateLocalPlant() {
	const [plantData, setPlantData] = useState(initialLocalPlantData);
	const [createPlantLoading, setCreatePlantLoading] = useState(false);
	const [createPlantResponse, setCreatePlantResponse] = useState<Plant | null>(
		null,
	);
	const [createPlantError, setCreatePlantError] = useState<unknown>(null);

	const onChange = (event: ChangeEvent<LocalCreateFieldElement>) => {
		const { id } = event.target;
		const value = getLocalCreateFieldValue(event);

		setPlantData((currentData) => ({
			...currentData,
			[id]: value,
		}));
	};

	const createPlantAsync = async (variables: CreatePlantLocalVariables) => {
		setCreatePlantLoading(true);
		setCreatePlantError(null);

		try {
			const response = await createLocalPlantPlaceholder(variables);
			setCreatePlantResponse(response);
			setPlantData(initialLocalPlantData);
			return response;
		} catch (error) {
			setCreatePlantError(error);
			throw error;
		} finally {
			setCreatePlantLoading(false);
		}
	};

	const createPlant = (variables: CreatePlantLocalVariables) => {
		void createPlantAsync(variables);
	};

	const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!plantData.name.trim() || !plantData.location.trim()) {
			setCreatePlantError(new Error("Plant name and location are required."));
			return;
		}

		createPlant({
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
		createPlant,
		createPlantAsync,
		createPlantLoading,
		createPlantResponse,
		createPlantError,
	};
}

export default useCreateLocalPlant;
