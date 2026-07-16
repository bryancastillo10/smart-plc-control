import { useMemo } from "react";

import {
	getPlantSetupStepDescription,
	plantSetupSteps,
} from "@/constants/plant_setup_steps";
import type { PlantSetupStepId } from "@/features/plant/type";
import { usePlantSetupStore } from "@/store/plantSetup";

export function usePlantSetupWorkflow() {
	const activeStepId = usePlantSetupStore((state) => state.activeStepId);
	const workflowState = usePlantSetupStore((state) => state.workflowState);
	const setActiveStepId = usePlantSetupStore((state) => state.setActiveStepId);
	const setPlant = usePlantSetupStore((state) => state.setPlant);
	const updatePlant = usePlantSetupStore((state) => state.updatePlant);

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
		setPlant,
		stepDescriptions,
		steps: plantSetupSteps,
		updatePlant,
		workflowState,
	};
}
