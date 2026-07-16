import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
	PlantSetupPlantInput,
	PlantSetupStepId,
	PlantSetupUser,
	PlantSetupWorkflowState,
} from "@/features/plant/type";
import type { AlertRule } from "@/types/alert-rule";
import type { Device } from "@/types/device";
import type { ProcessUnit } from "@/types/process-unit";
import type { ProcessUnitConnection } from "@/types/process-unit-connection";
import type { Simulation } from "@/types/simulation";
import type { SimulationScenario } from "@/types/simulation-scenario";
import type { Tag } from "@/types/tag";
import { usePlantSetupFormStore } from "@/store/plantSetupForms";

export const initialPlantSetupWorkflowState: PlantSetupWorkflowState = {
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

export interface PlantSetupState {
	activeStepId: PlantSetupStepId;
	workflowState: PlantSetupWorkflowState;
	setActiveStepId: (stepId: PlantSetupStepId) => void;
	setPlant: (plant: PlantSetupPlantInput) => void;
	updatePlant: (plant: Partial<PlantSetupPlantInput>) => void;
	setProcessUnits: (value: ProcessUnit[]) => void;
	setProcessUnitConnections: (value: ProcessUnitConnection[]) => void;
	setDevices: (value: Device[]) => void;
	setTags: (value: Tag[]) => void;
	setAlertRules: (value: AlertRule[]) => void;
	setSimulations: (value: Simulation[]) => void;
	setSimulationScenarios: (value: SimulationScenario[]) => void;
	setUsers: (value: PlantSetupUser[]) => void;
	resetWorkflow: () => void;
}

const updateWorkflow = <K extends keyof PlantSetupWorkflowState>(
	key: K,
	value: PlantSetupWorkflowState[K],
) =>
	(state: PlantSetupState) => ({
		workflowState: { ...state.workflowState, [key]: value },
	});

export const usePlantSetupStore = create<PlantSetupState>()(
	persist(
		(set) => ({
			activeStepId: "plant",
			workflowState: initialPlantSetupWorkflowState,
			setActiveStepId: (activeStepId) => set({ activeStepId }),
			setPlant: (plant) =>
				set((state) => ({
					workflowState: {
						...state.workflowState,
						plant: {
							...plant,
							id: plant.id ?? `plant-${crypto.randomUUID()}`,
							accessibleBy: plant.accessibleBy ?? [],
						},
					},
				})),
			updatePlant: (plant) =>
				set((state) => ({
					workflowState: {
						...state.workflowState,
						plant: state.workflowState.plant
							? { ...state.workflowState.plant, ...plant }
							: null,
					},
				})),
			setProcessUnits: (value) => set(updateWorkflow("processUnits", value)),
			setProcessUnitConnections: (value) =>
				set(updateWorkflow("processUnitConnections", value)),
			setDevices: (value) => set(updateWorkflow("devices", value)),
			setTags: (value) => set(updateWorkflow("tags", value)),
			setAlertRules: (value) => set(updateWorkflow("alertRules", value)),
			setSimulations: (value) => set(updateWorkflow("simulations", value)),
			setSimulationScenarios: (value) =>
				set(updateWorkflow("simulationScenarios", value)),
			setUsers: (value) => set(updateWorkflow("users", value)),
			resetWorkflow: () => {
				usePlantSetupFormStore.getState().resetForms();
				set({
					activeStepId: "plant",
					workflowState: initialPlantSetupWorkflowState,
				});
			},
		}),
		{
			name: "plant-setup-draft",
			storage: createJSONStorage(() => localStorage),
			version: 1,
			partialize: ({ activeStepId, workflowState }) => ({
				activeStepId,
				workflowState,
			}),
		},
	),
);
