import { currentUser } from "@/features/auth/queries";
import { toUserProfile } from "@/features/auth/userProfile";
import { useUserStore } from "@/store/user";
import {
	canAccessAuthenticatedPath,
	getAuthenticatedRedirectPath,
} from "@/utils/authRoutes";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export function useAuthenticatedRouteGuard() {
	const navigate = useNavigate();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);

	useEffect(() => {
		let isMounted = true;
		const store = useUserStore.getState();

		async function verifyAuthenticatedUser() {
			try {
				const user = await currentUser();
				const redirectPath = getAuthenticatedRedirectPath(user);

				if (!isMounted) {
					return;
				}

				store.setUser(toUserProfile(user));

				if (!canAccessAuthenticatedPath(user, pathname)) {
					void navigate({ to: redirectPath, replace: true });
					return;
				}

				setIsCheckingAuth(false);
			} catch {
				store.clearUser();

				if (isMounted) {
					void navigate({ to: "/", replace: true });
				}
			}
		}

		void verifyAuthenticatedUser();

		return () => {
			isMounted = false;
		};
	}, [navigate, pathname]);

	return { isCheckingAuth };
}
