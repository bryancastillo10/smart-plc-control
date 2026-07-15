import { ArrowLeft, ArrowRight } from "lucide-react";

import { PlantSetupStepPanel } from "@/components/plant-setup/PlantSetupStepPanel";
import { PlantSetupStepper } from "@/components/plant-setup/PlantSetupStepper";
import { Button } from "@/components/ui/button";
import { usePlantSetupWorkflow } from "@/features/plant/usePlantSetupWorkflow";
import {
	appButtonVariants,
	appSurfaceVariants,
	appTextVariants,
} from "@/styles/recipes";

export function PlantSetupWizard() {
	const workflow = usePlantSetupWorkflow();

	return (
		<div className="mx-auto max-w-6xl space-y-6">
			<section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div className="space-y-2">
					<p className={appTextVariants({ role: "kicker" })}>First-run setup</p>
					<h2 className={appTextVariants({ role: "sectionTitle" })}>
						Plant Setup Workflow
					</h2>
					<p className={appTextVariants({ role: "helper" })}>
						Move through the static setup shell for plant configuration before
						backend integration is added.
					</p>
				</div>
				<div className="text-sm font-semibold text-brand-muted">
					Step {workflow.activeStepIndex + 1} of {workflow.steps.length}
				</div>
			</section>

			<PlantSetupStepper
				activeStepId={workflow.activeStepId}
				activeStepIndex={workflow.activeStepIndex}
				onSelectStep={workflow.goToStep}
				steps={workflow.steps}
			/>

			<section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
				<PlantSetupStepPanel
					activeStep={workflow.activeStep}
					hasSimulatorDevice={workflow.hasSimulatorDevice}
					onSavePlant={workflow.setPlant}
					workflowState={workflow.workflowState}
				/>

				<aside className={appSurfaceVariants({ variant: "card" })}>
					<p className={appTextVariants({ role: "kicker" })}>Current step</p>
					<h3 className="mt-2 text-lg font-bold text-brand-ink">
						{workflow.activeStep.title}
					</h3>
					<p className="mt-2 text-sm leading-6 text-brand-muted">
						{workflow.activeStep.description}
					</p>
					<div className="mt-5 rounded-md border border-line-subtle bg-white/60 p-3 text-xs leading-5 text-brand-muted">
						{workflow.activeStepDescription}
					</div>
				</aside>
			</section>

			<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
				<Button
					disabled={!workflow.canGoBack}
					onClick={workflow.goBack}
					type="button"
					variant="outline"
				>
					<ArrowLeft className="size-4" />
					Previous
				</Button>
				<Button
					className={appButtonVariants({ size: "form" })}
					disabled={!workflow.canGoForward}
					onClick={workflow.goForward}
					type="button"
				>
					Next
					<ArrowRight className="size-4" />
				</Button>
			</div>
		</div>
	);
}
