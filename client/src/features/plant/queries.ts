import type { CreatePlantVariables, PlantResponse } from "@/features/plant/type";
import { apiFetch } from "@/utils/fetch";

export function createPlant(body: CreatePlantVariables) {
	return apiFetch<PlantResponse, CreatePlantVariables>("/plants", {
		method: "POST",
		body,
		credentials: "include",
	});
}