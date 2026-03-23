import { createFileRoute } from "@tanstack/react-router";
import {
	Activity,
	AlertTriangle,
	Droplets,
	Thermometer,
	Waves,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import MetricCard from "@/components/dashboard/MetricCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
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
import type { StatusTone } from "@/types/plc";
import { formatDate, formatTime } from "@/utils/formatDate";
import { formatMetric } from "@/utils/formatMetric";

export const Route = createFileRoute("/(protected)/dashboard")({
	component: DashboardPage,
});

function DashboardPage() {
	const { t } = useTranslation();
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

	const streamStatusCopy: Record<
		ReturnType<typeof usePlcStream>["status"],
		{ label: string; tone: StatusTone }
	> = {
		closed: {
			label: t("dashboardStatusReconnecting"),
			tone: "warning",
		},
		connecting: {
			label: t("dashboardStatusConnecting"),
			tone: "muted",
		},
		error: {
			label: t("dashboardStatusError"),
			tone: "warning",
		},
		open: {
			label: t("dashboardStatusLive"),
			tone: "live",
		},
	};

	const streamStatus = streamStatusCopy[status];
	const recentReadings = [...history].reverse().slice(0, 5);
	const operatorName =
		authUser?.username ?? authUser?.email ?? t("dashboardOperatorFallback");
	const qualityWindows = [
		{
			label: t("dashboardWindowPhStability"),
			status:
				currentReading && currentReading.pH >= 6.5 && currentReading.pH <= 8.2
					? t("dashboardWindowPhStable")
					: t("dashboardWindowPhWatch"),
		},
		{
			label: t("dashboardWindowTurbidity"),
			status:
				currentReading && currentReading.turbidity <= 10
					? t("dashboardWindowTurbidityStable")
					: t("dashboardWindowTurbidityHigh"),
		},
		{
			label: t("dashboardWindowDissolvedOxygen"),
			status:
				currentReading && currentReading.dissolvedOxygen >= 4
					? t("dashboardWindowDissolvedOxygenStable")
					: t("dashboardWindowDissolvedOxygenLow"),
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
								{t("dashboardSimulatorCadence")}
							</Badge>
						</div>
						<div>
							<p className="text-sm font-medium tracking-[0.28em] text-cyan-200 uppercase">
								{t("dashboardHeroEyebrow")}
							</p>
							<h1 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
								{t("dashboardHeroTitle", { operatorName })}
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 md:text-base">
								{t("dashboardHeroDescription", { endpoint: "/ws/plc" })}
							</p>
						</div>
					</div>
					<div className="grid gap-3 sm:grid-cols-3 lg:w-105 lg:grid-cols-1">
						<div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
							<p className="text-xs tracking-[0.24em] text-slate-300 uppercase">
								{t("dashboardStreamState")}
							</p>
							<p className="mt-2 text-2xl font-semibold text-white">
								{streamStatus.label}
							</p>
							<p className="mt-1 text-sm text-slate-300">
								{t("dashboardEndpointValue", { endpoint: "/ws/plc" })}
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
							<p className="text-xs tracking-[0.24em] text-slate-300 uppercase">
								{t("dashboardPacketsReceived")}
							</p>
							<p className="mt-2 text-2xl font-semibold text-white">
								{packetsReceived}
							</p>
							<p className="mt-1 text-sm text-slate-300">
								{t("dashboardPacketsReceivedDescription")}
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
							<p className="text-xs tracking-[0.24em] text-slate-300 uppercase">
								{t("dashboardLastUpdate")}
							</p>
							<p className="mt-2 text-lg font-semibold text-white">
								{lastUpdatedAt
									? formatDate(lastUpdatedAt, true)
									: t("dashboardWaitingForData")}
							</p>
							<p className="mt-1 text-sm text-slate-300">
								{t("dashboardNewestSampleDescription")}
							</p>
						</div>
					</div>
				</div>
			</section>

			{error ? (
				<Alert className="border-amber-500/30 bg-amber-500/10 text-amber-50">
					<AlertTriangle className="size-4" />
					<AlertTitle>{t("dashboardAlertTitle")}</AlertTitle>
					<AlertDescription>
						<p>{error}</p>
						<p>{t("dashboardAlertDescription")}</p>
					</AlertDescription>
				</Alert>
			) : null}

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<MetricCard
					accentClassName="bg-cyan-400/15 text-cyan-200"
					description={t("dashboardMetricFlowRateDescription")}
					icon={Waves}
					label={t("dashboardMetricFlowRate")}
					value={`${formatMetric(currentReading?.flowRate)} m3/s`}
				/>
				<MetricCard
					accentClassName="bg-emerald-400/15 text-emerald-200"
					description={t("dashboardMetricPhBalanceDescription")}
					icon={Activity}
					label={t("dashboardMetricPhBalance")}
					value={formatMetric(currentReading?.pH)}
				/>
				<MetricCard
					accentClassName="bg-sky-400/15 text-sky-200"
					description={t("dashboardMetricTurbidityDescription")}
					icon={Droplets}
					label={t("dashboardMetricTurbidity")}
					value={`${formatMetric(currentReading?.turbidity)} NTU`}
				/>
				<MetricCard
					accentClassName="bg-orange-400/15 text-orange-200"
					description={t("dashboardMetricTemperatureDescription")}
					icon={Thermometer}
					label={t("dashboardMetricTemperature")}
					value={`${formatMetric(currentReading?.temperature)} C`}
				/>
			</section>

			<section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
				<Card className="border-white/10 bg-slate-950/80 shadow-lg shadow-slate-950/10 backdrop-blur">
					<CardHeader>
						<CardTitle className="text-xl text-white">
							{t("dashboardTrendTitle")}
						</CardTitle>
						<CardDescription className="text-slate-400">
							{t("dashboardTrendDescription")}
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
											name={t("dashboardSeriesPh")}
											stroke="#34d399"
											strokeWidth={2.5}
											type="monotone"
										/>
										<Line
											dataKey="dissolvedOxygen"
											dot={false}
											name={t("dashboardSeriesDissolvedOxygen")}
											stroke="#38bdf8"
											strokeWidth={2.5}
											type="monotone"
										/>
										<Line
											dataKey="temperature"
											dot={false}
											name={t("dashboardSeriesTemperature")}
											stroke="#fb923c"
											strokeWidth={2.5}
											type="monotone"
										/>
									</LineChart>
								</ResponsiveContainer>
							) : (
								<div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 text-center text-sm text-slate-400">
									{t("dashboardTrendEmpty")}
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				<div className="grid gap-4">
					<Card className="border-white/10 bg-slate-950/80 shadow-lg shadow-slate-950/10 backdrop-blur">
						<CardHeader>
							<CardTitle className="text-xl text-white">
								{t("dashboardOperatingWindowsTitle")}
							</CardTitle>
							<CardDescription className="text-slate-400">
								{t("dashboardOperatingWindowsDescription")}
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
								{t("dashboardRecentPacketsTitle")}
							</CardTitle>
							<CardDescription className="text-slate-400">
								{t("dashboardRecentPacketsDescription")}
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
											<p>
												{t("dashboardRecentPacketPh", {
													value: reading.pH.toFixed(2),
												})}
											</p>
											<p>
												{t("dashboardRecentPacketTurbidity", {
													value: reading.turbidity.toFixed(2),
												})}
											</p>
											<p>
												{t("dashboardRecentPacketDissolvedOxygen", {
													value: reading.dissolvedOxygen.toFixed(2),
												})}
											</p>
											<p>
												{t("dashboardRecentPacketTemperature", {
													value: reading.temperature.toFixed(2),
												})}
											</p>
										</div>
									</div>
								))
							) : (
								<div className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
									{t("dashboardRecentPacketsEmpty")}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
}
