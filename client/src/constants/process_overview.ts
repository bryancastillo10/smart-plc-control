import type { PlantStatus, ReadingQuality } from "@/types/enum";
import type { ProcessUnitFlowType } from "@/types/process-unit-connection";

export type ProcessOverviewUnit = {
	id: string;
	name: string;
	type: string;
	status: PlantStatus;
	position: {
		x: number;
		y: number;
	};
	devices: {
		total: number;
		connected: number;
	};
	activeAlerts: number;
	keyReading: {
		label: string;
		value: string;
		unit: string;
		quality: ReadingQuality;
	};
};

export type ProcessOverviewConnection = {
	id: string;
	sourceUnitId: string;
	sourcePortId: string;
	targetUnitId: string;
	targetPortId: string;
	label: string;
	flowType: ProcessUnitFlowType;
};

export type ProcessOverview = {
	plantId: string;
	updatedAt: string;
	units: readonly ProcessOverviewUnit[];
	connections: readonly ProcessOverviewConnection[];
};


/**
 * Mirrors the anaerobic-digestion resources in server/api_tests.
 * Reading values, connectivity, and active-alert counts remain illustrative
 * because the HTTP fixtures define requests rather than response payloads.
 */
export const processOverviewPlaceholder = {
	plantId: "6203ddf0-52a1-4251-bafa-193f694d7601",
	updatedAt: "2026-08-10T09:30:00+08:00",
	units: [
		{
			id: "3c40fa37-a5bd-4b6b-953b-2ba45ed46728",
			name: "Acid Tank",
			type: "Acidogenesis",
			status: "ACTIVE",
			position: { x: 180, y: 120 },
			devices: { total: 1, connected: 1 },
			activeAlerts: 0,
			keyReading: {
				label: "Feed pump command",
				value: "ON",
				unit: "status",
				quality: "GOOD",
			},
		},
		{
			id: "ace1f696-ab30-4f07-9444-f98c98bbc494",
			name: "Methane Reactor",
			type: "Anaerobic Digestion",
			status: "MAINTENANCE",
			position: { x: 420.45, y: 140.25 },
			devices: { total: 1, connected: 0 },
			activeAlerts: 1,
			keyReading: {
				label: "Methane tank temperature",
				value: "58.4",
				unit: "degC",
				quality: "UNCERTAIN",
			},
		},
	],
	connections: [
		{
			id: "78228f63-0944-4bf7-9903-047563725572",
			sourceUnitId: "ace1f696-ab30-4f07-9444-f98c98bbc494",
			sourcePortId: "sludge-out",
			targetUnitId: "3c40fa37-a5bd-4b6b-953b-2ba45ed46728",
			targetPortId: "feed-in",
			label: "Methane Reactor sludge recycle to Acid Tank",
			flowType: "SLUDGE",
		},
	],
} satisfies ProcessOverview;
