import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LanguageSelect } from "@/components/layout/LanguageSelect";
import { PlantSetupStepPanel } from "@/components/plant-setup/PlantSetupStepPanel";
import { PlantSetupStepper } from "@/components/plant-setup/PlantSetupStepper";
import { Button } from "@/components/ui/button";
import { GlobalModal } from "@/components/ui/modal";
import { usePlantSetupWorkflow } from "@/features/plant/usePlantSetupWorkflow";
import {
	appButtonVariants,
	appSurfaceVariants,
	appTextVariants,
} from "@/styles/recipes";

export function PlantSetupWizard() {
	const { t } = useTranslation("plantSetup");
	const workflow = usePlantSetupWorkflow();

	return (
		<>
			<div className="mx-auto max-w-6xl space-y-6">
				<section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="space-y-2">
						<p className={appTextVariants({ role: "kicker" })}>
							{t("wizard.kicker")}
						</p>
						<h2 className={appTextVariants({ role: "sectionTitle" })}>
							{t("wizard.title")}
						</h2>
						<p className={appTextVariants({ role: "helper" })}>
							{t("wizard.description")}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<LanguageSelect />
						<span className="text-sm font-semibold text-brand-muted">
							{t("wizard.progress", {
								current: workflow.activeStepIndex + 1,
								total: workflow.steps.length,
							})}
						</span>
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
						onSavePlant={workflow.setPlant}
						workflowState={workflow.workflowState}
					/>

					<aside className={appSurfaceVariants({ variant: "card" })}>
						<p className={appTextVariants({ role: "kicker" })}>
							{t("wizard.currentStep")}
						</p>
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
						{t("wizard.previous")}
					</Button>
					<Button
						className={appButtonVariants({ size: "form" })}
						disabled={!workflow.canGoForward}
						onClick={workflow.goForward}
						type="button"
					>
						{t("wizard.next")}
						<ArrowRight className="size-4" />
					</Button>
				</div>
			</div>
			<GlobalModal />
		</>
	);
}
