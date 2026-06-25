import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const isAuthenticated = true; // TODO: replace with actual authentication

		if (!isAuthenticated) {
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
