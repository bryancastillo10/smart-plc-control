export type PlantHealthSummary = {
	plantId: string;
	updatedAt: string;
	devices: {
		total: number;
		connected: number;
		disconnected: number;
		connecting: number;
		error: number;
	};
	alerts: {
		active: number;
		critical: number;
		unacknowledged: number;
	};
	readings: {
		total: number;
		good: number;
		uncertain: number;
		bad: number;
		stale: number;
	};
};

export const plantHealthSummaryPlaceholder = {
	plantId: "6e08d162-aca6-4c21-aeb3-71f3f8e7fa72",
	updatedAt: "2026-08-10T09:30:00+08:00",
	devices: {
		total: 12,
		connected: 9,
		disconnected: 1,
		connecting: 1,
		error: 1,
	},
	alerts: {
		active: 7,
		critical: 2,
		unacknowledged: 4,
	},
	readings: {
		total: 48,
		good: 42,
		uncertain: 1,
		bad: 2,
		stale: 3,
	},
} satisfies PlantHealthSummary;
