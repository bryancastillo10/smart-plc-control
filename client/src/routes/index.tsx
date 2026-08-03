import { createFileRoute, isRedirect, redirect } from "@tanstack/react-router";

import LoginPage from "@/components/auth/LoginPage";
import { currentUser } from "@/features/auth/queries";
import { toUserProfile } from "@/features/auth/userProfile";
import { useUserStore } from "@/store/user";
import { getAuthenticatedRedirectPath } from "@/utils/authRoutes";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		if (typeof window === "undefined") return;

		const store = useUserStore.getState();
		if (store.user) {
			throw redirect({
				to: getAuthenticatedRedirectPath(store.user),
				replace: true,
			});
		}

		try {
			const authenticatedUser = await currentUser();
			store.setUser(toUserProfile(authenticatedUser));
			throw redirect({
				to: getAuthenticatedRedirectPath(authenticatedUser),
				replace: true,
			});
		} catch (error) {
			if (isRedirect(error)) throw error;
			return;
		}
	},
	component: LoginPage,
});
