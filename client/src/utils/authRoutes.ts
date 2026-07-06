import type { CurrentUserResponse } from "@/features/auth/type";

export const plantSetUpPath = "/plant-setup";
export const dashboardPath = "/dashboard";
export const loginPath = "/";

export function getAuthenticatedRedirectPath(user: CurrentUserResponse) {
	if (user.hasOwnedPlant) {
		return dashboardPath;
	}

	if (user.role === "ADMIN") {
		return plantSetUpPath;
	}

	return loginPath;
}

export function canAccessAuthenticatedPath(user: CurrentUserResponse, pathname: string) {
	if (user.hasOwnedPlant) {
		return true;
	}

	return user.role === "ADMIN" && pathname === plantSetUpPath;
}
