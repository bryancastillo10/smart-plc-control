import type { Device } from "@/types/device";
import type { Tag } from "@/types/tag";

export const deviceTypeLabelKeys = {
	PLC: "addDevice.types.plc",
	SIMULATOR: "addDevice.types.simulator",
	GATEWAY: "addDevice.types.gateway",
	SENSOR_GROUP: "addDevice.types.sensorGroup",
	ACTUATOR_GROUP: "addDevice.types.actuatorGroup",
} as const satisfies Record<Device["type"], string>;

export const tagDataTypeLabelKeys = {
	BOOL: "addTag.dataTypes.boolean",
	INT: "addTag.dataTypes.integer",
	FLOAT: "addTag.dataTypes.decimal",
	STRING: "addTag.dataTypes.text",
} as const satisfies Record<Tag["dataType"], string>;