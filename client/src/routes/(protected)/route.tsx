import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import Sidebar from "@/components/layout/sidebar";
import { getCurrentUserQueryOptions } from "@/hooks/use-get-user";

export const Route = createFileRoute("/(protected)")({
	beforeLoad: async ({ context, location }) => {
		try {
			await context.queryClient.ensureQueryData(getCurrentUserQueryOptions());
		} catch {
			throw redirect({
				to: "/sign-in",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex min-h-screen w-full flex-col md:flex-row">
			<Sidebar />
			<main className="flex-1 overflow-y-auto p-4 md:p-6">
				<Outlet />
			</main>
		</div>
	);
}
