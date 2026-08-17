import type { ReactNode } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	type PieSectorShapeProps,
	ResponsiveContainer,
	Sector,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import {
	mockSimulationReadings,
	type SimulationTelemetrySeriesDefinition,
	type SimulationTelemetryTimeSeriesPoint,
	simulationTelemetryHistoryExample,
	simulationTelemetrySeriesExample,
} from "@/constants/simulationReadings";
import type { SimulationTelemetrySnapshot } from "@/features/simulations/websocketTypes";
import { appTextVariants } from "@/styles/recipes";

const qualityColors = {
	GOOD: "#15803d",
	UNCERTAIN: "#d97706",
	BAD: "#dc2626",
	STALE: "#64748b",
} as const;
const timeFormatter = new Intl.DateTimeFormat("en-US", {
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
});

export function SimulationTelemetryCharts() {
	return (
		<section aria-labelledby="simulation-telemetry-title" className="space-y-4">
			<header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h3
						className={appTextVariants({ role: "sectionTitle" })}
						id="simulation-telemetry-title"
					>
						Simulation telemetry
					</h3>
					<p className="mt-1 text-sm leading-6 text-brand-muted">
						Example sensor readings for the simulation dashboard.
					</p>
				</div>
				<span className="inline-flex w-fit items-center gap-2 rounded-full border border-chip-line bg-chip px-3 py-1 text-xs font-bold text-brand-control">
					<span className="size-2 rounded-full bg-amber-500" />
					Placeholder data
				</span>
			</header>

			<div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
				<ChartCard
					description="A rolling window using each generated reading's server timestamp"
					title="Process trends"
				>
					<SimulationTimeSeriesChart
						history={simulationTelemetryHistoryExample}
						series={simulationTelemetrySeriesExample}
					/>
				</ChartCard>

				<ChartCard
					description={`${mockSimulationReadings.readings.length} example simulation readings`}
					title="Reading quality"
				>
					<SimulationReadingQualityChart telemetry={mockSimulationReadings} />
				</ChartCard>
			</div>
		</section>
	);
}

export function SimulationTimeSeriesChart({
	history,
	series,
}: {
	history: SimulationTelemetryTimeSeriesPoint[];
	series: SimulationTelemetrySeriesDefinition[];
}) {
	if (history.length === 0 || series.length === 0) {
		return <EmptyChart message="Waiting for generated sensor readings" />;
	}

	return (
		<div className="h-80 w-full">
			<ResponsiveContainer height="100%" width="100%">
				<LineChart
					data={history}
					margin={{ bottom: 8, left: 8, right: 16, top: 12 }}
				>
					<CartesianGrid strokeDasharray="3 3" vertical={false} />
					<XAxis
						dataKey="recordedAt"
						fontSize={11}
						minTickGap={28}
						tickFormatter={formatTime}
						tickLine={false}
					/>
					<YAxis domain={["auto", "auto"]} fontSize={11} tickLine={false} />
					<Tooltip labelFormatter={formatDateTime} />
					<Legend />
					{series.map((item) => (
						<Line
							activeDot={{ r: 5 }}
							connectNulls
							dataKey={item.dataKey}
							dot={history.length <= 12}
							key={item.tagId}
							name={formatSeriesName(item)}
							stroke={item.color}
							strokeWidth={2}
							type="monotone"
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}

function SimulationReadingQualityChart({
	telemetry,
}: {
	telemetry: SimulationTelemetrySnapshot;
}) {
	const data = Object.entries(
		telemetry.readings.reduce<Record<string, number>>((totals, reading) => {
			totals[reading.quality] = (totals[reading.quality] ?? 0) + 1;
			return totals;
		}, {}),
	).map(([name, value]) => ({ name, value }));

	if (data.length === 0) {
		return <EmptyChart message="Waiting for generated sensor readings" />;
	}

	return (
		<div className="h-80 w-full">
			<ResponsiveContainer height="100%" width="100%">
				<PieChart>
					<Pie
						data={data}
						dataKey="value"
						innerRadius={58}
						nameKey="name"
						outerRadius={92}
						paddingAngle={3}
						shape={renderQualitySector}
					/>
					<Tooltip />
					<Legend />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}

function renderQualitySector(props: PieSectorShapeProps) {
	const quality = (props.payload as { name?: string } | undefined)?.name;
	const fill =
		qualityColors[quality as keyof typeof qualityColors] ?? qualityColors.STALE;

	return <Sector {...props} fill={fill} />;
}

function formatSeriesName(series: SimulationTelemetrySeriesDefinition) {
	return series.unit
		? [series.name, `(${series.unit})`].join(" ")
		: series.name;
}

function formatTime(value: string) {
	return timeFormatter.format(new Date(value));
}

function formatDateTime(value: unknown) {
	return typeof value === "string"
		? new Date(value).toLocaleString()
		: String(value);
}

function EmptyChart({ message }: { message: string }) {
	return (
		<div className="flex h-80 items-center justify-center text-sm text-brand-muted">
			{message}
		</div>
	);
}

function ChartCard({
	children,
	description,
	title,
}: {
	children: ReactNode;
	description: string;
	title: string;
}) {
	return (
		<article className="rounded-lg border border-line-subtle bg-white/70 p-4 shadow-sm backdrop-blur">
			<h4 className="text-sm font-bold text-brand-ink">{title}</h4>
			<p className="mt-1 text-xs text-brand-muted">{description}</p>
			<div className="mt-4">{children}</div>
		</article>
	);
}
