import { z } from "zod";

const simulationStatusSchema = z.enum(["IDLE", "RUNNING", "PAUSED", "STOPPED"]);
const connectionStatusSchema = z.enum([
	"CONNECTED",
	"DISCONNECTED",
	"CONNECTING",
	"ERROR",
]);
const readingQualitySchema = z.enum(["GOOD", "UNCERTAIN", "BAD", "STALE"]);
const readingSourceSchema = z.enum([
	"SIMULATION",
	"MODBUS",
	"OPC_UA",
	"MANUAL",
]);
const alertSeveritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
const alertStatusSchema = z.enum(["ACTIVE", "ACKNOWLEDGED", "RESOLVED"]);

export const simulationSnapshotSchema = z.object({
	id: z.string(),
	plantId: z.string(),
	name: z.string(),
	status: simulationStatusSchema,
	updateIntervalMs: z.number(),
	noiseFactor: z.number(),
	startedAt: z.string().nullish(),
	pausedAt: z.string().nullish(),
	stoppedAt: z.string().nullish(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const deviceTelemetrySnapshotSchema = z.object({
	id: z.string(),
	plantId: z.string(),
	name: z.string(),
	connectionStatus: connectionStatusSchema,
	enabled: z.boolean(),
	lastConnectedAt: z.string().nullish(),
	updatedAt: z.string(),
});

export const tagReadingTelemetrySnapshotSchema = z.object({
	id: z.number(),
	plantId: z.string(),
	tagId: z.string(),
	deviceId: z.string(),
	processUnitId: z.string().nullish(),
	tagName: z.string(),
	unit: z.string(),
	valueNumeric: z.number().nullish(),
	valueText: z.string().optional(),
	valueBool: z.boolean().nullish(),
	quality: readingQualitySchema,
	source: readingSourceSchema,
	recordedAt: z.string(),
});

export const alertTelemetrySnapshotSchema = z.object({
	id: z.string(),
	plantId: z.string(),
	alertRuleId: z.string(),
	alertRuleName: z.string(),
	tagId: z.string(),
	tagName: z.string(),
	processUnitId: z.string().nullish(),
	severity: alertSeveritySchema,
	triggerValue: z.string(),
	status: alertStatusSchema,
	message: z.string(),
	triggeredAt: z.string(),
	acknowledgedAt: z.string().nullish(),
	resolvedAt: z.string().nullish(),
});

export const simulationTelemetrySnapshotSchema = z.object({
	plantId: z.string(),
	devices: z.array(deviceTelemetrySnapshotSchema),
	readings: z.array(tagReadingTelemetrySnapshotSchema),
	alerts: z.array(alertTelemetrySnapshotSchema),
});

const messageEnvelopeSchema = z.object({
	error: z.string().optional(),
	sentAt: z.string(),
});

export const simulationStreamMessageSchema = z.discriminatedUnion("type", [
	messageEnvelopeSchema.extend({
		type: z.literal("simulation.snapshot"),
		data: z.array(simulationSnapshotSchema).optional(),
	}),
	messageEnvelopeSchema.extend({
		type: z.literal("simulation.telemetry.snapshot"),
		data: simulationTelemetrySnapshotSchema.optional(),
	}),
]);

export type SimulationTelemetrySnapshot = z.infer<
	typeof simulationTelemetrySnapshotSchema
>;
export type SimulationStreamMessage = z.infer<
	typeof simulationStreamMessageSchema
>;

export function parseSimulationStreamMessage(value: string) {
	try {
		return simulationStreamMessageSchema.safeParse(JSON.parse(value));
	} catch {
		return simulationStreamMessageSchema.safeParse(null);
	}
}
