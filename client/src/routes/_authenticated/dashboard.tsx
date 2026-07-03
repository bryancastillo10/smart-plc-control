import { createFileRoute } from "@tanstack/react-router";
import { useUserStore } from "@/store/user";

const dashboardSections = [
	"Plant Overview",
	"Process Units",
	"Device Connectivity",
	"Tag Inventory",
	"Latest Tag Readings",
	"Reading Quality",
	"Active Alerts",
	"Alert Rules",
	"Simulation Status",
	"Simulation Scenarios",
	"Recent Audit Logs",
	"Users and Roles",
] as const;

export const Route = createFileRoute("/_authenticated/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const { user } = useUserStore();

	console.log(user);

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold text-brand-ink">
					Dashboard Overview
				</h2>
				<p className="mt-2 text-sm leading-6 text-brand-muted">
					A starting map of the plant, process, device, tag, alert, simulation,
					audit, and user areas represented by the server models.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{dashboardSections.map((section) => (
					<div
						key={section}
						className="rounded-md border border-line-subtle bg-white/55 p-4 shadow-sm backdrop-blur"
					>
						<h3 className="text-sm font-bold text-brand-ink">{section}</h3>
						<div className="mt-4 min-h-24 rounded-md border border-dashed border-line-subtle bg-surface-soft/60" />
					</div>
				))}
			</div>
		</div>
	);
}
