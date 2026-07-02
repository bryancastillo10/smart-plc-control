import type {
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
