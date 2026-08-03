import type {
	CurrentUserResponse,
	LogoutResponse,
	SignInResponse,
	SignInVariables,
	SignUpResponse,
	SignUpVariables,
} from "@/features/auth/type";
import { apiFetch } from "@/utils/fetch";

let currentUserCache: CurrentUserResponse | null = null;
let currentUserRequest: Promise<CurrentUserResponse> | null = null;

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

export function signUp(body: SignUpVariables) {
	return apiFetch<SignUpResponse, SignUpVariables>("/auth/register", {
		method: "POST",
		body,
		credentials: "omit",
		headers: {
			"Accept-Language": body.language,
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
	if (currentUserCache) return Promise.resolve(currentUserCache);
	if (currentUserRequest) return currentUserRequest;

	currentUserRequest = apiFetch<CurrentUserResponse>("/auth/me", {
		method: "GET",
		credentials: "include",
	})
		.then((user) => {
			currentUserCache = user;
			return user;
		})
		.catch((error: unknown) => {
			currentUserRequest = null;
			throw error;
		});

	return currentUserRequest;
}

export function clearCurrentUserCache() {
	currentUserCache = null;
	currentUserRequest = null;
}

export function markCurrentUserPlantSetupComplete() {
	if (currentUserCache) {
		currentUserCache = { ...currentUserCache, hasOwnedPlant: true };
	}
}
