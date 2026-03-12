import { apiFetch } from "@/api/fetch";
import type { User } from "@/types/user";

export function getCurrentUser() {
	return apiFetch<User>("/api/users", {
		method:"GET"
	}) }