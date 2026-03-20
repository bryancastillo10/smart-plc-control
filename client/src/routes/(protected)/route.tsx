import { createFileRoute, Outlet} from "@tanstack/react-router";

import Sidebar from "@/components/layout/sidebar";

export const Route = createFileRoute("/(protected)")({
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
