import {
	BellRing,
	Cpu,
	Factory,
	Gauge,
	GitBranch,
	LayoutDashboard,
	Map,
	Network,
	Tags,
	Users,
	type LucideIcon,
} from "lucide-react";

import type {
	PlantSetupStep,
	PlantSetupStepId,
	PlantSetupWorkflowState,
} from "@/types/plant-setup";

export const plantSetupSteps = [
	{
		id: "plant",
		title: "Create Plant Information",
		description: "Capture the basic plant identity and operating context.",
	},
	{
		id: "processUnits",
		title: "Create Process Units",
		description: "Prepare placeholders for treatment stages and equipment areas.",
	},
	{
		id: "diagram",
		title: "Arrange Process Diagram",
		description: "Plan the process layout and future unit connections.",
	},
	{
		id: "devices",
		title: "Create Devices",
		description: "Set up PLCs, gateways, simulators, and device groups.",
	},
	{
		id: "tags",
		title: "Create Tags and Assign Tags",
		description: "Prepare tag assignments for devices and process units.",
	},
	{
		id: "alertRules",
		title: "Create Alert Rules",
		description: "Define placeholders for threshold and severity rules.",
	},
	{
		id: "simulation",
		title: "Create Simulation",
		description: "Configure simulations later when a simulator device exists.",
	},
	{
		id: "users",
		title: "Create or Invite Users",
		description: "Plan who will operate and review this plant.",
	},
	{
		id: "review",
		title: "Review Setup",
		description: "Review all local setup data before finishing.",
	},
	{
		id: "dashboard",
		title: "Go to Dashboard",
		description: "Finish the static workflow with a dashboard placeholder.",
	},
] as const satisfies readonly PlantSetupStep[];

type PlantSetupStepDescriptionResolver = (
	workflowState: PlantSetupWorkflowState,
) => string;

export const plantSetupStepDescriptions = {
	plant: (workflowState) =>
		workflowState.plant
			? "Plant information has been started locally. You can refine the identity, location, status, and description before moving into process configuration."
			: "Start by defining the plant identity. This step will collect the plant name, location, status, and operating context in local state only.",
	processUnits: (workflowState) =>
		workflowState.processUnits.length > 0
			? `${workflowState.processUnits.length} process unit placeholder has been added locally. Use this step to keep shaping the treatment stages before arranging the diagram.`
			: "Add the major treatment stages and equipment areas that belong to the plant. Examples include tanks, reactors, clarifiers, pump stations, and custom process areas.",
	diagram: (workflowState) =>
		workflowState.processUnitConnections.length > 0
			? `${workflowState.processUnitConnections.length} local process connection is ready to review. Diagram persistence and drag behavior will be connected in a later phase.`
			: "Prepare the process flow layout and future process-unit connections. The interactive diagram will stay local until backend integration is added.",
	devices: (workflowState) =>
		workflowState.devices.length > 0
			? `${workflowState.devices.length} device placeholder is available in local state. Simulator devices can unlock the simulation setup step later.`
			: "Create placeholders for PLCs, simulator devices, gateways, sensor groups, or actuator groups without calling device APIs.",
	tags: (workflowState) =>
		workflowState.tags.length > 0
			? `${workflowState.tags.length} tag placeholder is ready for assignment review. Tags remain local and can later map to devices and process units.`
			: "Prepare tag placeholders and assign them to devices or process units. This phase does not read or write live PLC values.",
	alertRules: (workflowState) =>
		workflowState.alertRules.length > 0
			? `${workflowState.alertRules.length} alert rule placeholder is ready for review. Backend alert evaluation is intentionally deferred.`
			: "Define alert rule placeholders for tag thresholds, operators, severity, and enabled state without creating backend rules.",
	simulation: (workflowState) =>
		workflowState.devices.some((device) => device.type === "SIMULATOR")
			? "A simulator device exists in local state, so simulation and scenario placeholders can be prepared here."
			: "No simulator device exists in local state yet. This step remains a disabled placeholder until a simulator device is added.",
	users: (workflowState) =>
		workflowState.users.length > 0
			? `${workflowState.users.length} user placeholder is ready for operations planning. Invitations and user APIs remain out of scope.`
			: "Plan which users should operate or review the plant. No invitations, emails, or user-management API calls are sent in this phase.",
	review: (workflowState) =>
		`Review the local setup snapshot: ${workflowState.processUnits.length} process units, ${workflowState.devices.length} devices, ${workflowState.tags.length} tags, and ${workflowState.alertRules.length} alert rules.`,
	dashboard: () =>
		"Finish the static workflow with a dashboard placeholder. Navigation to /dashboard can be connected after the setup flow has real data.",
} satisfies Record<PlantSetupStepId, PlantSetupStepDescriptionResolver>;


export const stepIcons = {
	plant: Factory,
	processUnits: Network,
	diagram: GitBranch,
	devices: Cpu,
	tags: Tags,
	alertRules: BellRing,
	simulation: Gauge,
	users: Users,
	review: Map,
	dashboard: LayoutDashboard,
} as const satisfies Record<PlantSetupStepId, LucideIcon>;

export function getPlantSetupStepDescription(
	stepId: PlantSetupStepId,
	workflowState: PlantSetupWorkflowState,
) {
	return plantSetupStepDescriptions[stepId](workflowState);
}