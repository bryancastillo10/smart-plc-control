import type { CurrentUserResponse } from "@/features/auth/type";
import type { UserProfile } from "@/types/user";

type AuthRouteUser = Pick<CurrentUserResponse | UserProfile, "role" | "hasOwnedPlant">;

export const plantSetUpPath = "/plant-setup";
export const noPlantAccessPath = "/no-plant-access";
export const dashboardPath = "/dashboard";
export const loginPath = "/";

export function getAuthenticatedRedirectPath(user: AuthRouteUser) {
	if (user.hasOwnedPlant) {
		return dashboardPath;
	}

	if (user.role === "ADMIN") {
		return plantSetUpPath;
	}

	return noPlantAccessPath;
}

export function canAccessAuthenticatedPath(user: AuthRouteUser, pathname: string) {
	if (user.hasOwnedPlant) {
		return pathname !== plantSetUpPath && pathname !== noPlantAccessPath;
	}

	if (user.role === "ADMIN") {
		return pathname === plantSetUpPath;
	}

	return pathname === noPlantAccessPath;
}
