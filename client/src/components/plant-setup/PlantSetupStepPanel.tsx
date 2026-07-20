import type {
	PlantSetupPlantInput,
	PlantSetupStep,
	PlantSetupWorkflowState,
} from "@/features/plant/type";
import {
	appSurfaceVariants,
	appTextVariants,
} from "@/styles/recipes";

interface PlantSetupStepPanelProps {
	activeStep: PlantSetupStep;
	onSavePlant: (plant: PlantSetupPlantInput) => void;
	workflowState: PlantSetupWorkflowState;
}

import { plantSetUpDetails } from "@/constants/plant_setup_details";
import { stepIcons } from "@/constants/plant_setup_steps";
import { PlantInformationStep } from "@/components/plant-setup/PlantInformationStep";
import { ProcessUnitStep } from "@/components/plant-setup/ProcessUnitStep";
import { AddDeviceStep } from "@/components/plant-setup/AddDeviceStep";
import { AddTagStep } from "@/components/plant-setup/AddTagStep";
import { AddAlertRuleStep } from "@/components/plant-setup/AddAlertRuleStep";
import { AddSimulationStep } from "@/components/plant-setup/AddSimulationStep";
import { ProcessArrangementStep } from "@/components/plant-setup/process-arrangement/ProcessArrangementStep";


export function PlantSetupStepPanel({
	activeStep,
	onSavePlant,
	workflowState,
}: PlantSetupStepPanelProps) {
	const StepIcon = stepIcons[activeStep.id];
	const details = plantSetUpDetails[activeStep.id];

	return (
		<section className={appSurfaceVariants({ variant: "card" })}>
			<div className="mb-5 flex items-start gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-chip text-brand-control">
					<StepIcon className="size-5" />
				</div>
				<div className="space-y-1">
					<h3 className={appTextVariants({ role: "cardTitle" })}>
						{activeStep.title}
					</h3>
					<p className={appTextVariants({ role: "helper" })}>
						{activeStep.description}
					</p>
				</div>
			</div>

			{activeStep.id === "plant" ? (
				<PlantInformationStep
					onSavePlant={onSavePlant}
					plant={workflowState.plant}
				/>
			) : activeStep.id === "processUnits" ? (
				<ProcessUnitStep />
			) : activeStep.id === "devices" ? (
				<AddDeviceStep />
			) : activeStep.id === "tags" ? (
				<AddTagStep />
			) : activeStep.id === "diagram" ? (
				<ProcessArrangementStep />
			) : activeStep.id === "alertRules" ? (
				<AddAlertRuleStep />
			) : activeStep.id === "simulation" ? (
				<AddSimulationStep />
			) : (
				<div className="grid gap-3 md:grid-cols-2">
					{details.map((detail) => (
						<div
							className="rounded-md border border-line-subtle bg-white/60 p-4 text-sm leading-6 text-brand-muted"
							key={detail}
						>
							{detail}
						</div>
					))}
				</div>
			)}



			{activeStep.id === "review" ? (
				<LocalStateSummary workflowState={workflowState} />
			) : null}
		</section>
	);
}

function LocalStateSummary({
	workflowState,
}: {
	workflowState: PlantSetupWorkflowState;
}) {
	const summaryItems = [
		["Plant", workflowState.plant ? 1 : 0],
		["Process units", workflowState.processUnits.length],
		["Connections", workflowState.processUnitConnections.length],
		["Devices", workflowState.devices.length],
		["Tags", workflowState.tags.length],
		["Alert rules", workflowState.alertRules.length],
		["Simulations", workflowState.simulations.length],
		["Scenarios", workflowState.simulationScenarios.length],
		["Users", workflowState.users.length],
	] as const;

	return (
		<div className="mt-5 grid gap-2 sm:grid-cols-3">
			{summaryItems.map(([label, count]) => (
				<div
					className="rounded-md border border-line-subtle bg-white/60 px-3 py-2"
					key={label}
				>
					<p className="text-xs font-semibold text-brand-muted">{label}</p>
					<p className="mt-1 text-lg font-bold text-brand-ink">{count}</p>
				</div>
			))}
		</div>
	);
}
