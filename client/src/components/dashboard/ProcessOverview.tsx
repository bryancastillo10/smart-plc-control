import { BellRing, Boxes, RefreshCw, Wifi } from "lucide-react";
import ProcessFlowLayer from "@/components/dashboard/ProcessFlowLayer";
import { ProcessOverviewUnitCard } from "@/components/dashboard/ProcessOverviewUnitCard";
import type { ProcessOverview as ProcessOverviewData } from "@/constants/process_overview";
import { appTextVariants } from "@/styles/recipes";

type ProcessOverviewProps = {
	overview: ProcessOverviewData;
};

const unitWidth = 192;
const unitHeight = 208;
const canvasPadding = 32;

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
	dateStyle: "medium",
	timeStyle: "short",
	timeZone: "Asia/Taipei",
});

export function ProcessOverview({ overview }: ProcessOverviewProps) {
	const activeUnits = overview.units.filter(
		(unit) => unit.status === "ACTIVE",
	).length;
	const deviceTotals = overview.units.reduce(
		(totals, unit) => ({
			connected: totals.connected + unit.devices.connected,
			total: totals.total + unit.devices.total,
		}),
		{ connected: 0, total: 0 },
	);
	const activeAlerts = overview.units.reduce(
		(total, unit) => total + unit.activeAlerts,
		0,
	);
	const canvasWidth = Math.max(
		960,
		...overview.units.map(
			(unit) => unit.position.x + unitWidth + canvasPadding,
		),
	);
	const canvasHeight = Math.max(
		304,
		...overview.units.map(
			(unit) => unit.position.y + unitHeight + canvasPadding,
		),
	);

	return (
		<section aria-labelledby="process-overview-title" className="space-y-4">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h3
						className={appTextVariants({ role: "sectionTitle" })}
						id="process-overview-title"
					>
						Process overview
					</h3>
					<p className="mt-1 text-sm leading-6 text-brand-muted">
						Follow plant flow and spot operational issues at each process unit.
					</p>
				</div>
				<p className="flex items-center gap-2 text-xs font-semibold text-brand-muted">
					<RefreshCw aria-hidden="true" className="size-3.5" />
					Updated {dateTimeFormatter.format(new Date(overview.updatedAt))}
				</p>
			</header>

			<div className="overflow-hidden rounded-lg border border-line-subtle bg-surface-soft shadow-sm backdrop-blur">
				<div className="grid gap-3 border-b border-line-subtle bg-surface-strong/70 p-4 sm:grid-cols-3">
					<OverviewMetric
						icon={Boxes}
						label="Active units"
						value={`${activeUnits}/${overview.units.length}`}
					/>
					<OverviewMetric
						icon={Wifi}
						label="Connected devices"
						value={`${deviceTotals.connected}/${deviceTotals.total}`}
					/>
					<OverviewMetric
						critical={activeAlerts > 0}
						icon={BellRing}
						label="Active alerts"
						value={String(activeAlerts)}
					/>
				</div>

				<div className="overflow-x-auto">
					<div
						className="relative min-w-full bg-[radial-gradient(circle,var(--color-line-subtle)_1px,transparent_1px)] bg-size-[20px_20px]"
						style={{ height: canvasHeight, width: canvasWidth }}
					>
						<ProcessFlowLayer
							connections={overview.connections}
							unitHeight={unitHeight}
							units={overview.units}
							unitWidth={unitWidth}
						/>
						{overview.units.map((unit) => (
							<ProcessOverviewUnitCard key={unit.id} unit={unit} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function OverviewMetric({
	critical = false,
	icon: Icon,
	label,
	value,
}: {
	critical?: boolean;
	icon: typeof Boxes;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-center gap-3">
			<div
				className={`flex size-9 shrink-0 items-center justify-center rounded-md ${
					critical
						? "bg-destructive/10 text-destructive"
						: "bg-chip text-brand-control"
				}`}
			>
				<Icon aria-hidden="true" className="size-4" />
			</div>
			<div>
				<p className="text-xs font-semibold text-brand-muted">{label}</p>
				<p className="text-lg font-bold text-brand-ink">{value}</p>
			</div>
		</div>
	);
}
