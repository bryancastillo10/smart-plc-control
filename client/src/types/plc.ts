export type PlcSensorReading = {
	timestamp: string;
	flowRate: number;
	pH: number;
	turbidity: number;
	dissolvedOxygen: number;
	temperature: number;
};

export type PlcStreamStatus = "connecting" | "open" | "closed" | "error";

export type StatusTone = "live" | "muted" | "warning";