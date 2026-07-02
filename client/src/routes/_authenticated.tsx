import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { currentUser } from "@/features/auth/queries";
import { useUserStore } from "@/store/user";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		try {
			await currentUser();
		} catch {
			useUserStore.getState().clearUser();
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
