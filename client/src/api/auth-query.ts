import { apiFetch } from "@/api/fetch";
import type { AuthResponse, SignInRequest, SignUpRequest, SignOutResponse } from "@/types/auth";

export function signIn(data: SignInRequest) {
	return apiFetch<AuthResponse>("/api/auth/signin", {
		method:"POST",
		body: JSON.stringify(data)
	});
}

export function signUp(data: SignUpRequest) {
	return apiFetch<AuthResponse>("/api/auth/signup", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export function signOut() {
	return apiFetch<SignOutResponse>("/api/auth/signout", {
		method: "POST",
	});
}
