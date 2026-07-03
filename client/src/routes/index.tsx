import LoginPage from "@/components/auth/LoginPage";
import { currentUser } from "@/features/auth/queries";
import type { CurrentUserResponse } from "@/features/auth/type";
import { toUserProfile } from "@/features/auth/userProfile";
import { useUserStore } from "@/store/user";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	beforeLoad: async () => {
		if (typeof window === "undefined") {
			return;
		}

		const store = useUserStore.getState();

		if (store.validateAuth()) {
			throw redirect({ to: "/dashboard" });
		}

		let authenticatedUser: CurrentUserResponse | null = null;

		try {
			authenticatedUser = await currentUser();
		} catch {
			store.clearUser();
		}

		if (authenticatedUser) {
			store.setUser(toUserProfile(authenticatedUser));
			throw redirect({ to: "/dashboard" });
		}
	},
	component: HomePage,
});

function HomePage() {
	return <LoginPage />;
}
