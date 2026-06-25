import { createFileRoute } from "@tanstack/react-router";
import { appSurfaceVariants, appTextVariants } from "@/styles/recipes";

const equipmentSummarySections = [
	"Active Process Units",
	"Registered Devices",
	"Enabled Equipment",
	"Maintenance Units",
] as const;

const equipmentWorkspaceSections = [
	"Plant Context",
	"Process Unit Directory",
	"Process Unit Details",
	"Assigned Devices",
	"Device Protocol Settings",
	"Equipment Status Settings",
	"Tag Coverage by Unit",
	"Equipment Change History",
] as const;

export const Route = createFileRoute("/_authenticated/equipment")({
	component: EquipmentPage,
});

function EquipmentPage() {
	return (
		<div className="space-y-6">
			<section className="space-y-2">
				<h2 className={appTextVariants({ role: "sectionTitle" })}>Equipment</h2>
				<p className={appTextVariants({ role: "helper" })}>
					Structure and settings workspace for plants, process units, devices,
					protocols, equipment status, and unit-level configuration.
				</p>
			</section>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{equipmentSummarySections.map((section) => (
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

			<section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
				<div className="space-y-4">
					{equipmentWorkspaceSections.slice(0, 3).map((section) => (
						<div
							key={section}
							className={appSurfaceVariants({ variant: "card" })}
						>
							<h3 className={appTextVariants({ role: "cardTitle" })}>
								{section}
							</h3>
							<div className="mt-4 min-h-32 rounded-md border border-dashed border-line-subtle bg-surface-soft/60" />
						</div>
					))}
				</div>

				<div className="grid gap-4 lg:grid-cols-2">
					{equipmentWorkspaceSections.slice(3).map((section) => (
						<div
							key={section}
							className={appSurfaceVariants({ variant: "card" })}
						>
							<h3 className={appTextVariants({ role: "cardTitle" })}>
								{section}
							</h3>
							<div className="mt-4 min-h-32 rounded-md border border-dashed border-line-subtle bg-surface-soft/60" />
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
