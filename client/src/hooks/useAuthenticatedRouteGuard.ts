import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import { useUserStore } from "@/store/user";
import {
	canAccessAuthenticatedPath,
	getAuthenticatedRedirectPath,
} from "@/utils/authRoutes";

export function useAuthenticatedRouteGuard() {
	const navigate = useNavigate();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const user = useUserStore((state) => state.user);

	useEffect(() => {
		if (!user) {
			void navigate({ to: "/", replace: true });
			return;
		}
		if (!canAccessAuthenticatedPath(user, pathname)) {
			void navigate({
				to: getAuthenticatedRedirectPath(user),
				replace: true,
			});
		}
	}, [navigate, pathname, user]);

	return { isCheckingAuth: user === null };
}
