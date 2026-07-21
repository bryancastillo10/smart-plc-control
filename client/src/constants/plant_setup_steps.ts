import {
	BellRing,
	Cpu,
	Factory,
	Gauge,
	GitBranch,
	LayoutDashboard,
	Network,
	Tags,
	Users,
	type LucideIcon,
} from "lucide-react";

import type {
	PlantSetupStep,
	PlantSetupStepId,
	PlantSetupWorkflowState,
} from "@/features/plant/type";

export const plantSetupSteps = [
	{
		id: "plant",
		title: "Plant Information",
		description:
			"Define the plant identity, location, operating status, and overall purpose.",
	},
	{
		id: "processUnits",
		title: "Process Units",
		description:
			"Identify the main treatment stages, production areas, and supporting units in the plant.",
	},
	{
		id: "devices",
		title: "Devices and Control Equipment",
		description:
			"Register the equipment used to monitor, control, and exchange information across the process.",
	},
	{
		id: "tags",
		title: "Process Measurements and Signals",
		description:
			"Define the measurements, equipment states, and control signals used during operation.",
	},
	{
		id: "diagram",
		title: "Process Flow Arrangement",
		description:
			"Arrange the process units and show how materials or utilities move between them.",
	},
	{
		id: "alertRules",
		title: "Operating Alerts",
		description:
			"Set the operating conditions that require attention and indicate their level of urgency.",
	},
	{
		id: "simulation",
		title: "Process Simulation",
		description:
			"Prepare representative operating behavior for testing process conditions and responses.",
	},
	{
		id: "users",
		title: "Team and Responsibilities",
		description:
			"Assign the people responsible for operating, supervising, and reviewing the plant.",
	},
	{
		id: "dashboard",
		title: "Open Plant Overview",
		description:
			"Complete the setup and continue to the plant's operational overview.",
	},
] as const satisfies readonly PlantSetupStep[];

type PlantSetupStepDescriptionResolver = (
	workflowState: PlantSetupWorkflowState,
) => string;

function formatCount(count: number, singular: string, plural = `${singular}s`) {
	return `${count} ${count === 1 ? singular : plural}`;
}

export const plantSetupStepDescriptions = {
	plant: (workflowState) =>
		workflowState.plant
			? `${workflowState.plant.name} has been identified as the plant for this setup. Review its location, status, and description before defining the process.`
			: "Begin with the basic plant information. Use the description to summarize the plant's purpose, production scope, treatment capacity, or main operating responsibilities.",
	processUnits: (workflowState) =>
		workflowState.processUnits.length > 0
			? `${formatCount(workflowState.processUnits.length, "process unit")} defined. Confirm that the list represents the major stages and supporting areas needed to understand the complete process.`
			: "Break the plant into meaningful operating areas or unit operations, such as tanks, reactors, clarifiers, filters, pump stations, storage areas, and utility systems.",
	devices: (workflowState) =>
		workflowState.devices.length > 0
			? `${formatCount(workflowState.devices.length, "device")} identified. Check that the equipment needed to observe and control each process area is represented.`
			: "Identify the PLCs, gateways, simulators, and other control equipment that collect measurements, issue commands, or connect plant areas.",
	diagram: (workflowState) =>
		workflowState.processUnitConnections.length > 0
			? `${formatCount(workflowState.processUnitConnections.length, "process connection")} defined. Review the sequence and direction of flow between units.`
			: "Arrange the process units in their normal operating sequence, then describe how water, product, waste, chemicals, gas, or utilities pass from one unit to another.",
	tags: (workflowState) =>
		workflowState.tags.length > 0
			? `${formatCount(workflowState.tags.length, "measurement or signal")} defined. Confirm that each item is associated with the correct device and process area.`
			: "List the values operators need to monitor or control, such as flow, level, pressure, temperature, quality, equipment status, setpoints, and commands.",
	alertRules: (workflowState) =>
		workflowState.alertRules.length > 0
			? `${formatCount(workflowState.alertRules.length, "operating alert")} defined. Review each limit, urgency, and message to ensure it supports an appropriate operator response.`
			: "Define when an operating value requires attention. Consider normal limits, warning conditions, critical conditions, equipment protection, and the action expected from the operator.",
	simulation: (workflowState) =>
		workflowState.devices.some((device) => device.type === "SIMULATOR")
			? "A simulation source is available. Define representative values and operating changes that can be used to examine plant behavior under expected and unusual conditions."
			: "Add a simulator under Devices and Control Equipment if you want to examine plant behavior using representative operating values and scenarios.",
	users: (workflowState) =>
		workflowState.users.length > 0
			? `${formatCount(workflowState.users.length, "team member")} assigned. Confirm that operating, supervisory, and review responsibilities are appropriately covered.`
			: "Identify who will operate the plant, supervise performance, review conditions, or maintain the setup. Assign responsibilities according to each person's role.",
	dashboard: () =>
		"Open the plant overview to view the current local setup values before continuing.",
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
) {
	return plantSetupStepDescriptions[stepId](workflowState);
}
