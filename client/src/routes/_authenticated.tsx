import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { currentUser } from "@/features/auth/queries";
import { toUserProfile } from "@/features/auth/userProfile";
import { useUserStore } from "@/store/user";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		if (typeof window === "undefined") {
			return;
		}

		const store = useUserStore.getState();

		if (store.validateAuth()) {
			return;
		}

		try {
			const user = await currentUser();
			store.setUser(toUserProfile(user));
		} catch {
			store.clearUser();
			throw redirect({ to: "/" });
		}
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
}
