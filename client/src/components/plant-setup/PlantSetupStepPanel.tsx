import { AddAlertRuleStep } from "@/components/plant-setup/AddAlertRuleStep";
import { AddDeviceStep } from "@/components/plant-setup/AddDeviceStep";
import { AddSimulationStep } from "@/components/plant-setup/AddSimulationStep";
import { AddTagStep } from "@/components/plant-setup/AddTagStep";
import { PlantInformationStep } from "@/components/plant-setup/PlantInformationStep";
import { PlantOverviewStep } from "@/components/plant-setup/PlantOverviewStep";
import { PlantUsersStep } from "@/components/plant-setup/PlantUsersStep";
import { ProcessArrangementStep } from "@/components/plant-setup/process-arrangement/ProcessArrangementStep";
import { ProcessUnitStep } from "@/components/plant-setup/ProcessUnitStep";
import { plantSetUpDetails } from "@/constants/plant_setup_details";
import { stepIcons } from "@/constants/plant_setup_steps";
import type {
	PlantSetupPlantInput,
	PlantSetupStep,
	PlantSetupWorkflowState,
} from "@/features/plant/type";
import { appSurfaceVariants, appTextVariants } from "@/styles/recipes";

interface PlantSetupStepPanelProps {
	activeStep: PlantSetupStep;
	onSavePlant: (plant: PlantSetupPlantInput) => void;
	workflowState: PlantSetupWorkflowState;
}

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
			) : activeStep.id === "users" ? (
				<PlantUsersStep />
			) : activeStep.id === "dashboard" ? (
				<PlantOverviewStep />
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
		</section>
	);
}
