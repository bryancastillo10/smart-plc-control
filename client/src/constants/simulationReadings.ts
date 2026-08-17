import type { SimulationTelemetrySnapshot } from "@/features/simulations/websocketTypes";

export const mockSimulationReadings = {
	plantId: "6e08d162-aca6-4c21-aeb3-71f3f8e7fa72",
	devices: [
		{
			id: "9789a0b2-7bd0-4c68-80df-b33d69d0e371",
			plantId: "6e08d162-aca6-4c21-aeb3-71f3f8e7fa72",
			name: "Anaerobic Digester Simulator",
			connectionStatus: "CONNECTED",
			enabled: true,
			lastConnectedAt: "2026-08-17T10:24:00+08:00",
			updatedAt: "2026-08-17T10:24:00+08:00",
		},
	],
	readings: [
		{
			id: 101,
			plantId: "6e08d162-aca6-4c21-aeb3-71f3f8e7fa72",
			tagId: "a16969f1-045f-4c3a-9285-7f26de28d4bb",
			deviceId: "9789a0b2-7bd0-4c68-80df-b33d69d0e371",
			processUnitId: "577150a0-fd88-4380-bcbf-27d013521587",
			tagName: "Digester Temperature",
			unit: "°C",
			valueNumeric: 36.8,
			quality: "GOOD",
			source: "SIMULATION",
			recordedAt: "2026-08-17T10:24:12+08:00",
		},
		{
			id: 102,
			plantId: "6e08d162-aca6-4c21-aeb3-71f3f8e7fa72",
			tagId: "e5f4c187-3612-46fc-b894-234387bff8b4",
			deviceId: "9789a0b2-7bd0-4c68-80df-b33d69d0e371",
			processUnitId: "577150a0-fd88-4380-bcbf-27d013521587",
			tagName: "Digester pH",
			unit: "pH",
			valueNumeric: 7.12,
			quality: "GOOD",
			source: "SIMULATION",
			recordedAt: "2026-08-17T10:24:12+08:00",
		},
		{
			id: 103,
			plantId: "6e08d162-aca6-4c21-aeb3-71f3f8e7fa72",
			tagId: "1603fe26-2b59-4e48-a606-c69d8a5cce1d",
			deviceId: "9789a0b2-7bd0-4c68-80df-b33d69d0e371",
			processUnitId: "577150a0-fd88-4380-bcbf-27d013521587",
			tagName: "Methane Concentration",
			unit: "%",
			valueNumeric: 62.5,
			quality: "GOOD",
			source: "SIMULATION",
			recordedAt: "2026-08-17T10:24:12+08:00",
		},
		{
			id: 104,
			plantId: "6e08d162-aca6-4c21-aeb3-71f3f8e7fa72",
			tagId: "8eff816b-9520-4fc8-80de-36273790456d",
			deviceId: "9789a0b2-7bd0-4c68-80df-b33d69d0e371",
			processUnitId: "577150a0-fd88-4380-bcbf-27d013521587",
			tagName: "Biogas Flow",
			unit: "Nm³/h",
			valueNumeric: 84.2,
			quality: "GOOD",
			source: "SIMULATION",
			recordedAt: "2026-08-17T10:24:12+08:00",
		},
		{
			id: 105,
			plantId: "6e08d162-aca6-4c21-aeb3-71f3f8e7fa72",
			tagId: "634b1fa7-b449-4d9f-aa36-28e94d734687",
			deviceId: "9789a0b2-7bd0-4c68-80df-b33d69d0e371",
			processUnitId: "577150a0-fd88-4380-bcbf-27d013521587",
			tagName: "Digester Level",
			unit: "%",
			valueNumeric: 71.4,
			quality: "UNCERTAIN",
			source: "SIMULATION",
			recordedAt: "2026-08-17T10:24:12+08:00",
		},
		{
			id: 106,
			plantId: "6e08d162-aca6-4c21-aeb3-71f3f8e7fa72",
			tagId: "432c2548-dcdf-4767-9a48-feac8290aa62",
			deviceId: "9789a0b2-7bd0-4c68-80df-b33d69d0e371",
			processUnitId: "577150a0-fd88-4380-bcbf-27d013521587",
			tagName: "Agitator Running",
			unit: "",
			valueBool: true,
			quality: "GOOD",
			source: "SIMULATION",
			recordedAt: "2026-08-17T10:24:12+08:00",
		},
	],
	alerts: [
		{
			id: "0861d783-2300-4a8a-8a4f-f5511d4f3dd8",
			plantId: "6e08d162-aca6-4c21-aeb3-71f3f8e7fa72",
			alertRuleId: "2180ee89-2943-4014-84f8-7c1493ad2ed1",
			alertRuleName: "Digester level deviation",
			tagId: "634b1fa7-b449-4d9f-aa36-28e94d734687",
			tagName: "Digester Level",
			processUnitId: "577150a0-fd88-4380-bcbf-27d013521587",
			severity: "MEDIUM",
			triggerValue: "71.4",
			status: "ACTIVE",
			message: "Digester level is outside its preferred operating band.",
			triggeredAt: "2026-08-17T10:23:45+08:00",
		},
	],
} satisfies SimulationTelemetrySnapshot;
export type SimulationTelemetrySeriesDefinition = {
	color: string;
	dataKey: string;
	name: string;
	tagId: string;
	unit: string;
};

export type SimulationTelemetryTimeSeriesPoint = {
	recordedAt: string;
	[key: string]: number | string;
};

export function simulationTelemetryDataKey(tagId: string) {
	return `tag_${tagId.replaceAll("-", "_")}`;
}

const exampleSeriesTags = {
	temperature: "a16969f1-045f-4c3a-9285-7f26de28d4bb",
	ph: "e5f4c187-3612-46fc-b894-234387bff8b4",
	methane: "1603fe26-2b59-4e48-a606-c69d8a5cce1d",
	biogasFlow: "8eff816b-9520-4fc8-80de-36273790456d",
} as const;

export const simulationTelemetrySeriesExample = [
	{
		color: "#0f766e",
		dataKey: simulationTelemetryDataKey(exampleSeriesTags.temperature),
		name: "Digester Temperature",
		tagId: exampleSeriesTags.temperature,
		unit: "°C",
	},
	{
		color: "#2563eb",
		dataKey: simulationTelemetryDataKey(exampleSeriesTags.ph),
		name: "Digester pH",
		tagId: exampleSeriesTags.ph,
		unit: "pH",
	},
	{
		color: "#7c3aed",
		dataKey: simulationTelemetryDataKey(exampleSeriesTags.methane),
		name: "Methane Concentration",
		tagId: exampleSeriesTags.methane,
		unit: "%",
	},
	{
		color: "#d97706",
		dataKey: simulationTelemetryDataKey(exampleSeriesTags.biogasFlow),
		name: "Biogas Flow",
		tagId: exampleSeriesTags.biogasFlow,
		unit: "Nm³/h",
	},
] satisfies SimulationTelemetrySeriesDefinition[];

const exampleSamples = [
	["2026-08-17T10:24:01+08:00", 36.5, 7.08, 60.8, 79.4],
	["2026-08-17T10:24:02+08:00", 36.6, 7.09, 61.2, 80.1],
	["2026-08-17T10:24:03+08:00", 36.7, 7.1, 61.7, 81.5],
	["2026-08-17T10:24:04+08:00", 36.7, 7.11, 61.9, 82.1],
	["2026-08-17T10:24:05+08:00", 36.8, 7.12, 62.2, 82.8],
	["2026-08-17T10:24:06+08:00", 36.9, 7.11, 62.6, 83.6],
	["2026-08-17T10:24:07+08:00", 36.8, 7.12, 62.9, 84.4],
	["2026-08-17T10:24:08+08:00", 36.8, 7.13, 62.7, 84.8],
	["2026-08-17T10:24:09+08:00", 36.7, 7.12, 62.4, 84.1],
	["2026-08-17T10:24:10+08:00", 36.8, 7.12, 62.5, 84.2],
] as const;

export const simulationTelemetryHistoryExample = exampleSamples.map(
	([recordedAt, temperature, ph, methane, biogasFlow]) => ({
		recordedAt,
		[simulationTelemetryDataKey(exampleSeriesTags.temperature)]: temperature,
		[simulationTelemetryDataKey(exampleSeriesTags.ph)]: ph,
		[simulationTelemetryDataKey(exampleSeriesTags.methane)]: methane,
		[simulationTelemetryDataKey(exampleSeriesTags.biogasFlow)]: biogasFlow,
	}),
) satisfies SimulationTelemetryTimeSeriesPoint[];
