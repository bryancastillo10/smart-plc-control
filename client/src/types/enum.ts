export type Role = "ADMIN" | "OPERATOR" | "VIEWER";
export type UserRole = Role;

export type Language = "EN" | "ZH-TW";

export type PlantStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export type DeviceType =
	| "PLC"
	| "SIMULATOR"
	| "GATEWAY"
	| "SENSOR_GROUP"
	| "ACTUATOR_GROUP";

export type Protocol = "SIMULATOR" | "MODBUS_TCP" | "OPC_UA";

export type ConnectionStatus =
	| "CONNECTED"
	| "DISCONNECTED"
	| "CONNECTING"
	| "ERROR";

export type TagDataType = "BOOL" | "INT" | "FLOAT" | "STRING";

export type ReadingQuality = "GOOD" | "UNCERTAIN" | "BAD" | "STALE";

export type ReadingSource = "SIMULATION" | "MODBUS" | "OPC_UA" | "MANUAL";

export type AlertOperator = "GT" | "GTE" | "LT" | "LTE" | "EQ" | "NEQ";

export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AlertStatus = "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";

export type SimulationStatus = "IDLE" | "RUNNING" | "PAUSED" | "STOPPED";
