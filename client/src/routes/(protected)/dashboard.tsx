import { createFileRoute } from "@tanstack/react-router";
import {
	Activity,
	AlertTriangle,
	Droplets,
	Thermometer,
	Waves,
} from "lucide-react";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import useGetUser from "@/hooks/use-get-user";
import usePlcStream from "@/hooks/use-plc-stream";

import { formatDate, formatTime } from "@/utils/formatDate";
import { formatMetric } from "@/utils/formatMetric";
import type { StatusTone } from "@/types/plc";

import MetricCard from "@/components/dashboard/MetricCard";
import StatusBadge from "@/components/dashboard/StatusBadge";

export const Route = createFileRoute("/(protected)/dashboard")({
	component: DashboardPage,
});

const streamStatusCopy: Record<
	ReturnType<typeof usePlcStream>["status"],
	{ label: string; tone: StatusTone }
> = {
	closed: {
		label: "Reconnecting",
		tone: "warning",
	},
	connecting: {
		label: "Connecting",
		tone: "muted",
	},
	error: {
		label: "Stream error",
		tone: "warning",
	},
	open: {
		label: "Live stream",
		tone: "live",
	},
};

function DashboardPage() {
	const { authUser } = useGetUser();
	const {
		currentReading,
		error,
		hasData,
		history,
		lastUpdatedAt,
		packetsReceived,
		status,
	} = usePlcStream();

	const streamStatus = streamStatusCopy[status];
	const recentReadings = [...history].reverse().slice(0, 5);
	const operatorName = authUser?.username ?? authUser?.email ?? "operator";
	const qualityWindows = [
		{
			label: "pH stability",
			status:
				currentReading && currentReading.pH >= 6.5 && currentReading.pH <= 8.2
					? "Within expected band"
					: "Watch adjustment",
		},
		{
			label: "Turbidity",
			status:
				currentReading && currentReading.turbidity <= 10
					? "Stable for simulator"
					: "Above current simulation band",
		},
		{
			label: "Dissolved oxygen",
			status:
				currentReading && currentReading.dissolvedOxygen >= 4
					? "Aeration healthy"
					: "Below target",
		},
	];

	return (
		<div className="space-y-6 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_38%),linear-gradient(180deg,rgba(2,6,23,0.02),rgba(2,6,23,0))] pb-6">
			<section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-linear-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-slate-100 shadow-2xl shadow-cyan-950/20 lg:p-8">
				<div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.2),transparent_55%)]" />
				<div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-2xl space-y-4">
						<div className="flex flex-wrap items-center gap-3">
							<StatusBadge tone={streamStatus.tone} />
							<Badge className="border-white/15 bg-white/10 text-slate-100 hover:bg-white/10">
								Simulator cadence: 2s
							</Badge>
						</div>
						<div>
							<p className="text-sm font-medium tracking-[0.28em] text-cyan-200 uppercase">
								Plant telemetry desk
							</p>
							<h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
								Live PLC dashboard for {operatorName}
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
								The dashboard is now driven by websocket packets from
								<span className="font-medium text-white"> /ws/plc</span>, giving
								you a rolling view of water quality changes instead of a static
								placeholder.
							</p>
						</div>
					</div>
					<div className="grid gap-3 sm:grid-cols-3 lg:w-105 lg:grid-cols-1">
						<div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
							<p className="text-xs tracking-[0.24em] text-slate-300 uppercase">
								Stream state
							</p>
							<p className="mt-2 text-2xl font-semibold text-white">
								{streamStatus.label}
							</p>
							<p className="mt-1 text-sm text-slate-300">Endpoint: /ws/plc</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
							<p className="text-xs tracking-[0.24em] text-slate-300 uppercase">
								Packets received
							</p>
							<p className="mt-2 text-2xl font-semibold text-white">
								{packetsReceived}
							</p>
							<p className="mt-1 text-sm text-slate-300">
								Rolling buffer keeps the latest 12 readings.
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
							<p className="text-xs tracking-[0.24em] text-slate-300 uppercase">
								Last update
							</p>
							<p className="mt-2 text-lg font-semibold text-white">
								{lastUpdatedAt
									? formatDate(lastUpdatedAt, true)
									: "Waiting for data"}
							</p>
							<p className="mt-1 text-sm text-slate-300">
								Newest PLC sample received by the browser.
							</p>
						</div>
					</div>
				</div>
			</section>

			{error ? (
				<Alert className="border-amber-500/30 bg-amber-500/10 text-amber-50">
					<AlertTriangle className="size-4" />
					<AlertTitle>Websocket status requires attention</AlertTitle>
					<AlertDescription>
						<p>{error}</p>
						<p>The client will keep retrying the connection every 3 seconds.</p>
					</AlertDescription>
				</Alert>
			) : null}

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					accentClassName="bg-cyan-400/15 text-cyan-200"
					description="Main line throughput in cubic meters per second."
					icon={Waves}
					label="Flow rate"
					value={`${formatMetric(currentReading?.flowRate)} m3/s`}
				/>
				<MetricCard
					accentClassName="bg-emerald-400/15 text-emerald-200"
					description="Acidity window from the live PLC telemetry stream."
					icon={Activity}
					label="pH balance"
					value={formatMetric(currentReading?.pH)}
				/>
				<MetricCard
					accentClassName="bg-sky-400/15 text-sky-200"
					description="Current turbidity reading expressed in NTU."
					icon={Droplets}
					label="Turbidity"
					value={`${formatMetric(currentReading?.turbidity)} NTU`}
				/>
				<MetricCard
					accentClassName="bg-orange-400/15 text-orange-200"
					description="Tank temperature sampled from the simulator feed."
					icon={Thermometer}
					label="Temperature"
					value={`${formatMetric(currentReading?.temperature)} C`}
				/>
			</section>

			<section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
				<Card className="border-white/10 bg-slate-950/80 shadow-lg shadow-slate-950/10 backdrop-blur">
					<CardHeader>
						<CardTitle className="text-xl text-white">Trend monitor</CardTitle>
						<CardDescription className="text-slate-400">
							Rolling view of the last 12 websocket messages received from the
							PLC simulator.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-80 w-full rounded-2xl border border-white/8 bg-slate-900/80 p-3">
							{hasData ? (
								<ResponsiveContainer width="100%" height="100%">
									<LineChart
										data={history}
										margin={{ left: 0, right: 12, top: 8, bottom: 0 }}
									>
										<CartesianGrid stroke="#33415566" strokeDasharray="3 3" />
										<XAxis
											axisLine={false}
											dataKey="timestamp"
											minTickGap={24}
											stroke="#94a3b8"
											tickFormatter={(value) => formatTime(String(value))}
											tickLine={false}
										/>
										<YAxis
											axisLine={false}
											stroke="#94a3b8"
											tickLine={false}
											width={40}
										/>
										<Tooltip
											contentStyle={{
												backgroundColor: "#020617",
												border: "1px solid rgba(148, 163, 184, 0.2)",
												borderRadius: "14px",
												color: "#e2e8f0",
											}}
											formatter={(value, name) => [
												typeof value === "number"
													? value.toFixed(2)
													: String(value ?? "--"),
												String(name),
											]}
											labelFormatter={(value) =>
												formatDate(String(value), true)
											}
										/>
										<Line
											dataKey="pH"
											dot={false}
											name="pH"
											stroke="#34d399"
											strokeWidth={2.5}
											type="monotone"
										/>
										<Line
											dataKey="dissolvedOxygen"
											dot={false}
											name="Dissolved O2"
											stroke="#38bdf8"
											strokeWidth={2.5}
											type="monotone"
										/>
										<Line
											dataKey="temperature"
											dot={false}
											name="Temperature"
											stroke="#fb923c"
											strokeWidth={2.5}
											type="monotone"
										/>
									</LineChart>
								</ResponsiveContainer>
							) : (
								<div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 text-center text-sm text-slate-400">
									Waiting for the first PLC websocket packet.
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-4">
					<Card className="border-white/10 bg-slate-950/80 shadow-lg shadow-slate-950/10 backdrop-blur">
						<CardHeader>
							<CardTitle className="text-xl text-white">
								Operating windows
							</CardTitle>
							<CardDescription className="text-slate-400">
								Quick readouts derived from the most recent PLC message.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{qualityWindows.map((windowItem) => (
								<div
									key={windowItem.label}
									className="rounded-2xl border border-white/8 bg-slate-900/80 p-4"
								>
									<p className="text-xs font-medium tracking-[0.22em] text-slate-400 uppercase">
										{windowItem.label}
									</p>
									<p className="mt-2 text-base font-medium text-white">
										{windowItem.status}
									</p>
								</div>
							))}
						</CardContent>
					</Card>

					<Card className="border-white/10 bg-slate-950/80 shadow-lg shadow-slate-950/10 backdrop-blur">
						<CardHeader>
							<CardTitle className="text-xl text-white">
								Recent packets
							</CardTitle>
							<CardDescription className="text-slate-400">
								Latest websocket samples received by the browser.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3">
							{recentReadings.length > 0 ? (
								recentReadings.map((reading) => (
									<div
										key={reading.timestamp}
										className="rounded-2xl border border-white/8 bg-slate-900/80 p-4"
									>
										<div className="flex items-center justify-between gap-3">
											<p className="text-sm font-medium text-white">
												{formatDate(reading.timestamp, true)}
											</p>
											<Badge className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/5">
												{reading.flowRate.toFixed(2)} m3/s
											</Badge>
										</div>
										<div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-300">
											<p>pH {reading.pH.toFixed(2)}</p>
											<p>Turbidity {reading.turbidity.toFixed(2)} NTU</p>
											<p>
												Dissolved O2 {reading.dissolvedOxygen.toFixed(2)} mg/L
											</p>
											<p>Temperature {reading.temperature.toFixed(2)} C</p>
										</div>
									</div>
								))
							) : (
								<div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
									No websocket packets yet.
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
}
