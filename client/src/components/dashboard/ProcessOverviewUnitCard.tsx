import { BellRing, Factory, Wifi } from "lucide-react";

import type { ProcessOverviewUnit } from "@/constants/process_overview";

type ProcessOverviewUnitCardProps = {
	unit: ProcessOverviewUnit;
};

export function ProcessOverviewUnitCard({
	unit,
}: ProcessOverviewUnitCardProps) {
	const allDevicesConnected = unit.devices.connected === unit.devices.total;

	return (
		<article
			aria-label={`${unit.name}, ${unit.status.toLowerCase()}`}
			className="absolute w-48 rounded-lg border border-line-subtle bg-surface-strong p-4 shadow-md backdrop-blur"
			style={{ left: unit.position.x, top: unit.position.y }}
		>
			<header className="flex items-start justify-between gap-2">
				<div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-chip text-brand-control">
					<Factory aria-hidden="true" className="size-4" />
				</div>
				<UnitStatus status={unit.status} />
			</header>

			<div className="mt-3 min-w-0">
				<h4 className="truncate text-sm font-bold text-brand-ink">
					{unit.name}
				</h4>
				<p className="mt-0.5 truncate text-xs text-brand-muted">{unit.type}</p>
			</div>

			<div className="mt-3 rounded-md border border-line-subtle bg-surface-soft px-3 py-2">
				<div className="flex items-center justify-between gap-2">
					<p className="truncate text-xs font-semibold text-brand-muted">
						{unit.keyReading.label}
					</p>
					<ReadingQuality quality={unit.keyReading.quality} />
				</div>
				<p className="mt-1 text-lg font-bold text-brand-ink">
					{unit.keyReading.value}
					<span className="ml-1 text-xs font-semibold text-brand-muted">
						{unit.keyReading.unit}
					</span>
				</p>
			</div>

			<footer className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold">
				<span
					className={`flex items-center gap-1.5 ${
						allDevicesConnected ? "text-brand-control" : "text-destructive"
					}`}
				>
					<Wifi aria-hidden="true" className="size-3.5" />
					{unit.devices.connected}/{unit.devices.total}
				</span>
				<span
					className={`flex items-center gap-1.5 ${
						unit.activeAlerts > 0 ? "text-destructive" : "text-brand-muted"
					}`}
				>
					<BellRing aria-hidden="true" className="size-3.5" />
					{unit.activeAlerts}
				</span>
			</footer>
		</article>
	);
}

function UnitStatus({ status }: { status: ProcessOverviewUnit["status"] }) {
	const needsAttention = status !== "ACTIVE";

	return (
		<span
			className={`rounded-full border px-2 py-1 text-[0.625rem] font-bold tracking-wide ${
				needsAttention
					? "border-line-subtle bg-surface-soft text-brand-muted"
					: "border-chip-line bg-chip text-brand-control"
			}`}
		>
			{status}
		</span>
	);
}

function ReadingQuality({
	quality,
}: {
	quality: ProcessOverviewUnit["keyReading"]["quality"];
}) {
	const tone =
		quality === "GOOD"
			? "border-chip-line bg-chip text-brand-control"
			: quality === "BAD"
				? "border-destructive/20 bg-destructive/10 text-destructive"
				: "border-line-subtle bg-surface-soft text-brand-muted";

	return (
		<span
			className={`rounded-full border px-1.5 py-0.5 text-[0.625rem] font-bold ${tone}`}
		>
			{quality}
		</span>
	);
}
