import type { TFunction } from "i18next";
import {
	BellRing,
	Cpu,
	Factory,
	Gauge,
	GitBranch,
	LayoutDashboard,
	type LucideIcon,
	Network,
	Tags,
	Users,
} from "lucide-react";

import type {
	PlantSetupStepId,
	PlantSetupWorkflowState,
} from "@/features/plant/type";

export const plantSetupSteps = [
	{
		id: "plant",
		titleKey: "steps.plant.title",
		descriptionKey: "steps.plant.description",
	},
	{
		id: "processUnits",
		titleKey: "steps.processUnits.title",
		descriptionKey: "steps.processUnits.description",
	},
	{
		id: "devices",
		titleKey: "steps.devices.title",
		descriptionKey: "steps.devices.description",
	},
	{
		id: "tags",
		titleKey: "steps.tags.title",
		descriptionKey: "steps.tags.description",
	},
	{
		id: "diagram",
		titleKey: "steps.diagram.title",
		descriptionKey: "steps.diagram.description",
	},
	{
		id: "alertRules",
		titleKey: "steps.alertRules.title",
		descriptionKey: "steps.alertRules.description",
	},
	{
		id: "simulation",
		titleKey: "steps.simulation.title",
		descriptionKey: "steps.simulation.description",
	},
	{
		id: "users",
		titleKey: "steps.users.title",
		descriptionKey: "steps.users.description",
	},
	{
		id: "dashboard",
		titleKey: "steps.dashboard.title",
		descriptionKey: "steps.dashboard.description",
	},
] as const satisfies readonly {
	id: PlantSetupStepId;
	titleKey: string;
	descriptionKey: string;
}[];

type PlantSetupStepDescriptionResolver = (
	workflowState: PlantSetupWorkflowState,
	t: TFunction<"plantSetup">,
) => string;

export const plantSetupStepDescriptions = {
	plant: (workflowState, t) =>
		workflowState.plant
			? t("steps.plant.details.configured", {
					name: workflowState.plant.name,
				})
			: t("steps.plant.details.empty"),
	processUnits: (workflowState, t) =>
		workflowState.processUnits.length > 0
			? t("steps.processUnits.details.configured", {
					count: workflowState.processUnits.length,
				})
			: t("steps.processUnits.details.empty"),
	devices: (workflowState, t) =>
		workflowState.devices.length > 0
			? t("steps.devices.details.configured", {
					count: workflowState.devices.length,
				})
			: t("steps.devices.details.empty"),
	diagram: (workflowState, t) =>
		workflowState.processUnitConnections.length > 0
			? t("steps.diagram.details.configured", {
					count: workflowState.processUnitConnections.length,
				})
			: t("steps.diagram.details.empty"),
	tags: (workflowState, t) =>
		workflowState.tags.length > 0
			? t("steps.tags.details.configured", {
					count: workflowState.tags.length,
				})
			: t("steps.tags.details.empty"),
	alertRules: (workflowState, t) =>
		workflowState.alertRules.length > 0
			? t("steps.alertRules.details.configured", {
					count: workflowState.alertRules.length,
				})
			: t("steps.alertRules.details.empty"),
	simulation: (workflowState, t) =>
		workflowState.devices.some((device) => device.type === "SIMULATOR")
			? t("steps.simulation.details.available")
			: t("steps.simulation.details.unavailable"),
	users: (workflowState, t) =>
		workflowState.users.length > 0
			? t("steps.users.details.configured", {
					count: workflowState.users.length,
				})
			: t("steps.users.details.empty"),
	dashboard: (_workflowState, t) => t("steps.dashboard.details.default"),
} satisfies Record<PlantSetupStepId, PlantSetupStepDescriptionResolver>;

export const stepIcons = {
	plant: Factory,
	processUnits: Network,
	devices: Cpu,
	diagram: GitBranch,
	tags: Tags,
	alertRules: BellRing,
	simulation: Gauge,
	users: Users,
	dashboard: LayoutDashboard,
} as const satisfies Record<PlantSetupStepId, LucideIcon>;

export function getPlantSetupStepDescription(
	stepId: PlantSetupStepId,
	workflowState: PlantSetupWorkflowState,
	t: TFunction<"plantSetup">,
) {
	return plantSetupStepDescriptions[stepId](workflowState, t);
}
