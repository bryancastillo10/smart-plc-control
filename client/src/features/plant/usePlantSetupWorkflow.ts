import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
	getPlantSetupStepDescription,
	plantSetupSteps,
} from "@/constants/plant_setup_steps";
import type { PlantSetupStepId } from "@/features/plant/type";
import { usePlantSetupStore } from "@/store/plantSetup";

export function usePlantSetupWorkflow() {
	const { t } = useTranslation("plantSetup");
	const activeStepId = usePlantSetupStore((state) => state.activeStepId);
	const workflowState = usePlantSetupStore((state) => state.workflowState);
	const setActiveStepId = usePlantSetupStore((state) => state.setActiveStepId);
	const setPlant = usePlantSetupStore((state) => state.setPlant);
	const updatePlant = usePlantSetupStore((state) => state.updatePlant);

	const steps = useMemo(
		() =>
			plantSetupSteps.map((step) => ({
				id: step.id,
				title: t(step.titleKey),
				description: t(step.descriptionKey),
			})),
		[t],
	);
	const activeStepIndex = steps.findIndex((step) => step.id === activeStepId);
	const safeActiveStepIndex = activeStepIndex >= 0 ? activeStepIndex : 0;
	const activeStep = steps[safeActiveStepIndex];
	const canGoBack = safeActiveStepIndex > 0;
	const canGoForward = safeActiveStepIndex < steps.length - 1;

	const hasSimulatorDevice = useMemo(
		() => workflowState.devices.some((device) => device.type === "SIMULATOR"),
		[workflowState.devices],
	);

	const stepDescriptions = useMemo(
		() =>
			Object.fromEntries(
				steps.map((step) => [
					step.id,
					getPlantSetupStepDescription(step.id, workflowState, t),
				]),
			) as Record<PlantSetupStepId, string>,
		[steps, t, workflowState],
	);
	const activeStepDescription = stepDescriptions[activeStep.id];

	const goBack = () => {
		if (canGoBack) {
			setActiveStepId(steps[safeActiveStepIndex - 1].id);
		}
	};

	const goForward = () => {
		if (canGoForward) {
			setActiveStepId(steps[safeActiveStepIndex + 1].id);
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
		steps,
		updatePlant,
		workflowState,
	};
}
