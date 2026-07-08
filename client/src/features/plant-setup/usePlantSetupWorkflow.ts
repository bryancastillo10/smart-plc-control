import { useMemo, useState } from "react";

import {
	getPlantSetupStepDescription,
	plantSetupSteps,
} from "@/constants/plant_setup_steps";
import type {
	PlantSetupStepId,
	PlantSetupWorkflowState,
} from "@/types/plant-setup";

const initialWorkflowState: PlantSetupWorkflowState = {
	plant: null,
	processUnits: [],
	processUnitConnections: [],
	devices: [],
	tags: [],
	alertRules: [],
	simulations: [],
	simulationScenarios: [],
	users: [],
};

export function usePlantSetupWorkflow() {
	const [activeStepId, setActiveStepId] = useState<PlantSetupStepId>("plant");
	const [workflowState] = useState<PlantSetupWorkflowState>(initialWorkflowState);

	const activeStepIndex = plantSetupSteps.findIndex(
		(step) => step.id === activeStepId,
	);
	const safeActiveStepIndex = activeStepIndex >= 0 ? activeStepIndex : 0;
	const activeStep = plantSetupSteps[safeActiveStepIndex];
	const canGoBack = safeActiveStepIndex > 0;
	const canGoForward = safeActiveStepIndex < plantSetupSteps.length - 1;

	const hasSimulatorDevice = useMemo(
		() => workflowState.devices.some((device) => device.type === "SIMULATOR"),
		[workflowState.devices],
	);

	const stepDescriptions = useMemo(
		() =>
			plantSetupSteps.reduce(
				(currentDescriptions, step) => ({
					...currentDescriptions,
					[step.id]: getPlantSetupStepDescription(step.id, workflowState),
				}),
				{} as Record<PlantSetupStepId, string>,
			),
		[workflowState],
	);
	const activeStepDescription = stepDescriptions[activeStep.id];

	const goBack = () => {
		if (canGoBack) {
			setActiveStepId(plantSetupSteps[safeActiveStepIndex - 1].id);
		}
	};

	const goForward = () => {
		if (canGoForward) {
			setActiveStepId(plantSetupSteps[safeActiveStepIndex + 1].id);
		}
	};

	return {
		activeStep,
		activeStepDescription,
		activeStepId,
		activeStepIndex: safeActiveStepIndex,
		canGoBack,
		canGoForward,
		goBack,
		goForward,
		goToStep: setActiveStepId,
		hasSimulatorDevice,
		stepDescriptions,
		steps: plantSetupSteps,
		workflowState,
	};
}