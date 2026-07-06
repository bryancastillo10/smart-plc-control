import LoginPage from "@/components/auth/LoginPage";
import { currentUser } from "@/features/auth/queries";
import type { CurrentUserResponse } from "@/features/auth/type";
import { toUserProfile } from "@/features/auth/userProfile";
import { useUserStore } from "@/store/user";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		if (typeof window === "undefined") {
			return;
		}

		const store = useUserStore.getState();

		let authenticatedUser: CurrentUserResponse;

		try {
			authenticatedUser = await currentUser();
		} catch {
			store.clearUser();
			return;
		}

		store.setUser(toUserProfile(authenticatedUser));
		throw redirect({ to: "/dashboard", replace: true });
	},
	component: HomePage,
});

function HomePage() {
	const navigate = useNavigate();
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);

	useEffect(() => {
		let isMounted = true;
		const store = useUserStore.getState();

		async function redirectAuthenticatedUser() {
			try {
				const authenticatedUser = await currentUser();

				if (!isMounted) {
					return;
				}

				store.setUser(toUserProfile(authenticatedUser));
				void navigate({ to: "/dashboard", replace: true });
			} catch {
				store.clearUser();

				if (isMounted) {
					setIsCheckingAuth(false);
				}
			}
		}

		void redirectAuthenticatedUser();

		return () => {
			isMounted = false;
		};
	}, [navigate]);

	if (isCheckingAuth) {
		return null;
	}

	return <LoginPage />;
}
