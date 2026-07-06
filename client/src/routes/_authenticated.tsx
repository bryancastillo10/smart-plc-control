import { AppLayout } from "@/components/layout/AppLayout";
import { currentUser } from "@/features/auth/queries";
import { toUserProfile } from "@/features/auth/userProfile";
import { useAuthenticatedRouteGuard } from "@/hooks/useAuthenticatedRouteGuard";
import { useUserStore } from "@/store/user";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		if (typeof window === "undefined") {
			return;
		}

		const store = useUserStore.getState();

		try {
			const user = await currentUser();
			store.setUser(toUserProfile(user));
		} catch {
			store.clearUser();
			throw redirect({ to: "/", replace: true });
		}
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	const { isCheckingAuth } = useAuthenticatedRouteGuard();

	if (isCheckingAuth) {
		return null;
	}

	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}
