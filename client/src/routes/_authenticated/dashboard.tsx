import { createFileRoute } from "@tanstack/react-router";

import { PlantHealthSummary } from "@/components/dashboard/PlantHealthSummary";
import { plantHealthSummaryPlaceholder } from "@/constants/dashboard";

const dashboardSections = [
	"Process Units",
	"Tag Inventory",
	"Latest Tag Readings",
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
	return (
		<div className="space-y-8">
			<header>
				<h2 className="text-2xl font-bold text-brand-ink">
					Dashboard Overview
				</h2>
				<p className="mt-2 text-sm leading-6 text-brand-muted">
					Monitor the current condition of your plant and identify areas that
					need attention.
				</p>
			</header>

			<PlantHealthSummary summary={plantHealthSummaryPlaceholder} />

			<section aria-labelledby="dashboard-sections-title" className="space-y-4">
				<h3
					className="text-lg font-bold text-brand-ink"
					id="dashboard-sections-title"
				>
					Operational details
				</h3>
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{dashboardSections.map((section) => (
						<div
							key={section}
							className="rounded-md border border-line-subtle bg-white/55 p-4 shadow-sm backdrop-blur"
						>
							<h4 className="text-sm font-bold text-brand-ink">{section}</h4>
							<div className="mt-4 min-h-24 rounded-md border border-dashed border-line-subtle bg-surface-soft/60" />
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
