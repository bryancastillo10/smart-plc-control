import {
	Activity,
	BellRing,
	RefreshCw,
	Siren,
	Wifi,
} from "lucide-react";
import PlantHealthCard from "@/components/dashboard/PlantHealthCard";

import type { PlantHealthSummary as PlantHealthSummaryData } from "@/constants/dashboard";
import { appTextVariants } from "@/styles/recipes";

type PlantHealthSummaryProps = {
	summary: PlantHealthSummaryData;
};


const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
	dateStyle: "medium",
	timeStyle: "short",
	timeZone: "Asia/Taipei",
});

export function PlantHealthSummary({ summary }: PlantHealthSummaryProps) {
	const connectedPercentage = percentage(
		summary.devices.connected,
		summary.devices.total,
	);
	const goodReadingPercentage = percentage(
		summary.readings.good,
		summary.readings.total,
	);
	const needsAttention =
		summary.alerts.critical > 0 ||
		summary.devices.error > 0 ||
		summary.readings.bad > 0;

	return (
		<section aria-labelledby="plant-health-title" className="space-y-4">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<div className="flex flex-wrap items-center gap-3">
						<h3
							className={appTextVariants({ role: "sectionTitle" })}
							id="plant-health-title"
						>
							Plant health summary
						</h3>
						<HealthStatus needsAttention={needsAttention} />
					</div>
					<p className="mt-1 text-sm leading-6 text-brand-muted">
						A quick view of connectivity, alerts, and data quality across the
						plant.
					</p>
				</div>

				<p className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
					<RefreshCw aria-hidden="true" className="size-3.5" />
					Updated {dateTimeFormatter.format(new Date(summary.updatedAt))}
				</p>
			</header>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<PlantHealthCard
					detail={`${summary.devices.disconnected} disconnected · ${summary.devices.connecting} connecting · ${summary.devices.error} error`}
					icon={Wifi}
					label="Connected devices"
					progress={connectedPercentage}
					total={summary.devices.total}
					value={summary.devices.connected}
				/>
				<PlantHealthCard
					detail={`${summary.alerts.unacknowledged} awaiting acknowledgement`}
					icon={BellRing}
					label="Active alerts"
					value={summary.alerts.active}
				/>
				<PlantHealthCard
					detail={
						summary.alerts.critical === 0
							? "No immediate action required"
							: "Immediate attention required"
					}
					icon={Siren}
					label="Critical alerts"
					tone="critical"
					value={summary.alerts.critical}
				/>
				<PlantHealthCard
					detail={`${summary.readings.uncertain} uncertain · ${summary.readings.bad} bad · ${summary.readings.stale} stale`}
					icon={Activity}
					label="Good readings"
					progress={goodReadingPercentage}
					total={summary.readings.total}
					value={summary.readings.good}
				/>
			</div>
		</section>
	);
}

function HealthStatus({ needsAttention }: { needsAttention: boolean }) {
	return (
		<span
			className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-bold ${
				needsAttention
					? "border-destructive/20 bg-destructive/10 text-destructive"
					: "border-chip-line bg-chip text-brand-control"
			}`}
		>
			<span
				aria-hidden="true"
				className={`size-2 rounded-full ${needsAttention ? "bg-destructive" : "bg-brand-control"}`}
			/>
			{needsAttention ? "Attention needed" : "Operating normally"}
		</span>
	);
}

function percentage(value: number, total: number) {
	if (total <= 0) {
		return 0;
	}

	return Math.round((value / total) * 100);
}
