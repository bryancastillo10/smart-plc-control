import type {
	CurrentUserResponse,
	LogoutResponse,
	SignInResponse,
	SignInVariables,
} from "@/features/auth/type";
import { apiFetch } from "@/utils/fetch";

export function signIn({ language, ...body }: SignInVariables) {
	return apiFetch<SignInResponse>("/auth/login", {
		method: "POST",
		body,
		credentials: "include",
		headers: {
			"Accept-Language": language,
		},
	});
}

export function logout() {
	return apiFetch<LogoutResponse>("/auth/logout", {
		method: "POST",
		credentials: "include",
	});
}

export function currentUser() {
	return apiFetch<CurrentUserResponse>("/auth/me", {
		method: "GET",
		credentials: "include",
	});
}
