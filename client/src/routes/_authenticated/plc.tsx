import { createFileRoute } from "@tanstack/react-router";
import { appSurfaceVariants, appTextVariants } from "@/styles/recipes";

const plcSummarySections = [
	"Connected PLCs",
	"Enabled Control Tags",
	"Manual Writes Today",
	"Connection Issues",
] as const;

const plcWorkspaceSections = [
	"PLC Device Selector",
	"Connection Status",
	"Control Command Panel",
	"Writable Tags",
	"Live Tag Readings",
	"Safety Interlocks",
	"Simulation Controls",
	"Recent Control Activity",
] as const;

export const Route = createFileRoute("/_authenticated/plc")({
	component: PlcPage,
});

function PlcPage() {
	return (
		<div className="space-y-6">
			<section className="space-y-2">
				<h2 className={appTextVariants({ role: "sectionTitle" })}>
					PLC Control
				</h2>
				<p className={appTextVariants({ role: "helper" })}>
					Operational workspace for PLC devices, connection state, writable
					tags, manual commands, simulations, and control audit activity.
				</p>
			</section>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{plcSummarySections.map((section) => (
					<div
						key={section}
						className={appSurfaceVariants({ variant: "card" })}
					>
						<h3 className={appTextVariants({ role: "cardTitle" })}>
							{section}
						</h3>
						<div className="mt-4 min-h-16 rounded-md border border-dashed border-line-subtle bg-surface-soft/60" />
					</div>
				))}
			</section>

			<section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
				<div className="space-y-4">
					{plcWorkspaceSections.slice(0, 4).map((section) => (
						<div
							key={section}
							className={appSurfaceVariants({ variant: "card" })}
						>
							<h3 className={appTextVariants({ role: "cardTitle" })}>
								{section}
							</h3>
							<div className="mt-4 min-h-28 rounded-md border border-dashed border-line-subtle bg-surface-soft/60" />
						</div>
					))}
				</div>

				<div className="space-y-4">
					{plcWorkspaceSections.slice(4).map((section) => (
						<div
							key={section}
							className={appSurfaceVariants({ variant: "card" })}
						>
							<h3 className={appTextVariants({ role: "cardTitle" })}>
								{section}
							</h3>
							<div className="mt-4 min-h-28 rounded-md border border-dashed border-line-subtle bg-surface-soft/60" />
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
