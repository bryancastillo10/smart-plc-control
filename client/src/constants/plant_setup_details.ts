import type { PlantSetupStepId } from "@/features/plant/type";

export const plantSetUpDetails = {
	plant: [
		"Plant name, location, status, and description will be captured here.",
		"This phase keeps the plant record in local React state only.",
	],
	processUnits: [
		"Process units such as tanks, reactors, clarifiers, and pump stations will be listed here.",
		"Multiple local process units can be added in the next implementation pass.",
	],
	diagram: [
		"The custom process diagram shell will live here.",
		"Dragging, bounded positions, and SVG connection lines are intentionally deferred.",
	],
	devices: [
		"PLC, simulator, gateway, sensor group, and actuator group placeholders will be managed here.",
		"Backend device connection actions are out of scope for this static phase.",
	],
	tags: [
		"Device tags and optional process-unit assignments will be prepared here.",
		"Tag creation will remain local until API integration is added later.",
	],
	alertRules: [
		"Threshold, operator, severity, and enabled-state placeholders will be shown here.",
		"No alert engine or backend rule creation is part of this shell.",
	],
	simulation: [
		"Simulation and scenario placeholders will be configured here when simulator devices are available.",
		"For now, this step explains the future conditional workflow.",
	],
	users: [
		"Admin-created users and operator invitations will be represented here later.",
		"No emails or user-management API calls are made in this static phase.",
	],
	review: [
		"A final review summary will show the local workflow state before finishing.",
		"This shell already reserves the review step for accumulated setup data.",
	],
	dashboard: [
		"The final action will eventually navigate to /dashboard.",
		"For this phase, the dashboard destination remains a placeholder.",
	],
} as const satisfies Record<PlantSetupStepId, readonly string[]>;