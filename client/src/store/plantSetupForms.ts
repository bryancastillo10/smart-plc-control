import type { SetStateAction } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CreatePlantRequest } from "@/features/plant/type";
import type { CreateAlertRuleRequest } from "@/types/alert-rule";
import type { CreateDeviceLocalRequest } from "@/types/device";
import type { CreateProcessUnitConnectionLocalRequest } from "@/types/process-unit-connection";
import type { CreateProcessUnitLocalRequest } from "@/types/process-unit";
import type { CreateSimulationLocalRequest } from "@/types/simulation";
import type { CreateTagLocalRequest } from "@/types/tag";

import type { PlantSetupFormState } from "@/types/plant-setup";


// Initial State Values
export const initialPlantData: CreatePlantRequest = {
	name: "",
	location: "",
	description: "",
	status: "ACTIVE",
};

export const initialProcessUnitData: CreateProcessUnitLocalRequest = {
	name: "",
	type: "",
	description: "",
	status: "ACTIVE",
	position: { x: 120, y: 120 },
	ports: [
		{ id: "in", label: "In", direction: "IN" },
		{ id: "out", label: "Out", direction: "OUT" },
	],
	icon: "Factory",
};

export const initialConnectionData: CreateProcessUnitConnectionLocalRequest = {
	sourceUnitId: "",
	sourcePortId: "out",
	targetUnitId: "",
	targetPortId: "in",
	label: "",
	flowType: "WASTEWATER",
};

export const initialDeviceData: CreateDeviceLocalRequest = {
	name: "",
	type: "PLC",
	description: "",
	protocol: "MODBUS_TCP",
	host: "",
	port: undefined,
	connectionStatus: "DISCONNECTED",
	enabled: true,
	position: { x: 160, y: 160 },
	icon: "Cpu",
};

export const initialTagData: CreateTagLocalRequest = {
	deviceId: "",
	processUnitId: "",
	name: "",
	address: "",
	dataType: "FLOAT",
	unit: "",
	description: "",
	enabled: true,
};

export const initialAlertRuleData: CreateAlertRuleRequest = {
	tagId: "",
	name: "",
	operator: "GT",
	threshold: "",
	severity: "MEDIUM",
	message: "",
	enabled: true,
};

export const initialSimulationData: CreateSimulationLocalRequest = {
	plantId: "",
	name: "",
	status: "IDLE",
	updateIntervalMs: 1000,
	noiseFactor: 0,
};


//  Plant Set Up Form Zustand States

const resolve = <T>(value: SetStateAction<T>, current: T) =>
	typeof value === "function" ? (value as (previous: T) => T)(current) : value;

export const usePlantSetupFormStore = create<PlantSetupFormState>()(
	persist(
		(set) => ({
			plantData: initialPlantData,
			processUnitData: initialProcessUnitData,
			connectionData: initialConnectionData,
			deviceData: initialDeviceData,
			tagData: initialTagData,
			alertRuleData: initialAlertRuleData,
			simulationData: initialSimulationData,
			setPlantData: (value) => set((state) => ({ plantData: resolve(value, state.plantData) })),
			setProcessUnitData: (value) => set((state) => ({ processUnitData: resolve(value, state.processUnitData) })),
			setConnectionData: (value) => set((state) => ({ connectionData: resolve(value, state.connectionData) })),
			setDeviceData: (value) => set((state) => ({ deviceData: resolve(value, state.deviceData) })),
			setTagData: (value) => set((state) => ({ tagData: resolve(value, state.tagData) })),
			setAlertRuleData: (value) => set((state) => ({ alertRuleData: resolve(value, state.alertRuleData) })),
			setSimulationData: (value) => set((state) => ({ simulationData: resolve(value, state.simulationData) })),
			resetForms: () => set({
				plantData: initialPlantData,
				processUnitData: initialProcessUnitData,
				connectionData: initialConnectionData,
				deviceData: initialDeviceData,
				tagData: initialTagData,
				alertRuleData: initialAlertRuleData,
				simulationData: initialSimulationData,
			}),
		}),
		{
			name: "plant-setup-form-drafts",
			storage: createJSONStorage(() => localStorage),
			version: 1,
		},
	),
);
