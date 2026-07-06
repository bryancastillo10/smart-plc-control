import { useUserStore } from "@/store/user";
import type { UserRole } from "@/types/enum";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function useRoleGuard(allowedRoles: readonly UserRole[], redirectTo = "/dashboard") {
	const navigate = useNavigate();
	const userRole = useUserStore((state) => state.user?.role);
	const isAllowed = userRole ? allowedRoles.includes(userRole) : false;

	useEffect(() => {
		if (userRole && !isAllowed) {
			void navigate({ to: redirectTo, replace: true });
		}
	}, [allowedRoles, isAllowed, navigate, redirectTo, userRole]);

	return { isAllowed, userRole };
}
