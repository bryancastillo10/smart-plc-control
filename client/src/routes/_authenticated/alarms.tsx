import { createFileRoute } from "@tanstack/react-router";
import { appSurfaceVariants, appTextVariants } from "@/styles/recipes";

const alarmSummarySections = [
	"Active Alerts",
	"Critical Severity",
	"Acknowledged Alerts",
	"Enabled Rules",
] as const;

const alarmWorkspaceSections = [
	"Active Alert Queue",
	"Alert Detail and Response",
	"Acknowledgement Workflow",
	"Resolution Tracking",
	"Alert Rule Directory",
	"Threshold Configuration",
	"Severity and Delay Settings",
	"Rule Message Templates",
	"Alert History",
	"Alert Audit Trail",
] as const;

export const Route = createFileRoute("/_authenticated/alarms")({
	component: AlarmsPage,
});

function AlarmsPage() {
	return (
		<div className="space-y-6">
			<section className="space-y-2">
				<h2 className={appTextVariants({ role: "sectionTitle" })}>Alarms</h2>
				<p className={appTextVariants({ role: "helper" })}>
					Alert response and rule-management workspace for active alerts,
					acknowledgement, resolution, thresholds, severity, delay, and history.
				</p>
			</section>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{alarmSummarySections.map((section) => (
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

			<section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
				<div className="space-y-4">
					{alarmWorkspaceSections.slice(0, 5).map((section) => (
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
					{alarmWorkspaceSections.slice(5).map((section) => (
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
