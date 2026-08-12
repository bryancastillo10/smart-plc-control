export const simulationStreamQueryKeys = {
	all: ["simulation-stream"] as const,
	telemetry: (plantId: string) =>
		[...simulationStreamQueryKeys.all, "telemetry", plantId] as const,
};
