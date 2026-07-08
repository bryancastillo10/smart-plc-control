import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useCreatePlant from "@/features/plant/useCreatePlant";
import {
	appButtonVariants,
	appSurfaceVariants,
	appTextVariants,
} from "@/styles/recipes";
import { cn } from "@/utils/utils";
import { CheckCircle2, Circle, Factory, GitBranch, Map, Network } from "lucide-react";
import { useMemo, useState } from "react";

type WizardStepId = "plant" | "processUnits" | "diagram" | "review";

interface WizardStep {
	id: WizardStepId;
	title: string;
	description: string;
}

const wizardSteps: WizardStep[] = [
	{
		id: "plant",
		title: "Plant Details",
		description: "Create the initial plant record.",
	},
	{
		id: "processUnits",
		title: "Process Units",
		description: "Add treatment stages and equipment areas.",
	},
	{
		id: "diagram",
		title: "Diagram Layout",
		description: "Arrange units into the operating flow.",
	},
	{
		id: "review",
		title: "Review",
		description: "Check setup progress before entering the workspace.",
	},
];

export function PlantSetupWizard() {
	const [activeStepId, setActiveStepId] = useState<WizardStepId>("plant");
	const activeStepIndex = wizardSteps.findIndex((step) => step.id === activeStepId);
	const activeStep = wizardSteps[activeStepIndex] ?? wizardSteps[0];

	const canGoBack = activeStepIndex > 0;
	const canGoForward = activeStepIndex < wizardSteps.length - 1;

	const goBack = () => {
		if (canGoBack) {
			setActiveStepId(wizardSteps[activeStepIndex - 1].id);
		}
	};

	const goForward = () => {
		if (canGoForward) {
			setActiveStepId(wizardSteps[activeStepIndex + 1].id);
		}
	};

	return (
		<div className="mx-auto max-w-6xl space-y-6">
			<section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div className="space-y-2">
					<p className={appTextVariants({ role: "kicker" })}>First-run setup</p>
					<h2 className={appTextVariants({ role: "sectionTitle" })}>
						Plant Setup Wizard
					</h2>
					<p className={appTextVariants({ role: "helper" })}>
						Create the first plant, define process units, and prepare the diagram
						before opening the operating workspace.
					</p>
				</div>
				<div className="text-sm font-semibold text-brand-muted">
					Step {activeStepIndex + 1} of {wizardSteps.length}
				</div>
			</section>

			<WizardProgress
				activeStepId={activeStep.id}
				activeStepIndex={activeStepIndex}
				onSelectStep={setActiveStepId}
			/>

			<section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
				<div>
					{activeStep.id === "plant" ? <PlantDetailsStep /> : null}
					{activeStep.id === "processUnits" ? <ProcessUnitsStep /> : null}
					{activeStep.id === "diagram" ? <DiagramLayoutStep /> : null}
					{activeStep.id === "review" ? <ReviewStep /> : null}
				</div>

				<WizardSummary activeStep={activeStep} />
			</section>

			<div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
				<Button type="button" variant="outline" onClick={goBack} disabled={!canGoBack}>
					Back
				</Button>
				<Button
					type="button"
					className={appButtonVariants({ size: "form" })}
					onClick={goForward}
					disabled={!canGoForward}
				>
					Next
				</Button>
			</div>
		</div>
	);
}

function WizardProgress({
	activeStepId,
	activeStepIndex,
	onSelectStep,
}: {
	activeStepId: WizardStepId;
	activeStepIndex: number;
	onSelectStep: (stepId: WizardStepId) => void;
}) {
	return (
		<nav aria-label="Plant setup progress" className="grid gap-3 md:grid-cols-4">
			{wizardSteps.map((step, index) => {
				const isActive = step.id === activeStepId;
				const isComplete = index < activeStepIndex;
				const StepIcon = isComplete ? CheckCircle2 : Circle;

				return (
					<button
						key={step.id}
						type="button"
						onClick={() => onSelectStep(step.id)}
						className={cn(
							"flex min-h-24 rounded-md border p-4 text-left transition-colors",
							isActive
								? "border-brand-control bg-chip text-brand-ink shadow-sm"
								: "border-line-subtle bg-white/55 text-brand-muted hover:bg-chip",
						)}
						aria-current={isActive ? "step" : undefined}
					>
						<span className="mr-3 mt-0.5 text-brand-control">
							<StepIcon className="size-4" />
						</span>
						<span>
							<span className="block text-sm font-bold">{step.title}</span>
							<span className="mt-1 block text-xs leading-5">{step.description}</span>
						</span>
					</button>
				);
			})}
		</nav>
	);
}

function PlantDetailsStep() {
	const { plantData, onChange, handleSubmit, createPlantLoading } = useCreatePlant();

	return (
		<section className={appSurfaceVariants({ variant: "card" })}>
			<div className="mb-5 flex items-start gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-chip text-brand-control">
					<Factory className="size-5" />
				</div>
				<div className="space-y-1">
					<h3 className={appTextVariants({ role: "cardTitle" })}>
						Create First Plant
					</h3>
					<p className={appTextVariants({ role: "helper" })}>
						Start with the plant record. Process units and diagram layout can be
						configured in the following steps.
					</p>
				</div>
			</div>

			<form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<Label htmlFor="name">Plant Name</Label>
					<Input
						id="name"
						value={plantData.name}
						onChange={onChange}
						placeholder="Main Production Plant"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="location">Location</Label>
					<Input
						id="location"
						value={plantData.location}
						onChange={onChange}
						placeholder="Hsinchu, Taiwan"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="status">Initial Status</Label>
					<Input
						id="status"
						value={plantData.status ?? "ACTIVE"}
						onChange={onChange}
						placeholder="ACTIVE"
					/>
				</div>

				<div className="space-y-2 md:col-span-2">
					<Label htmlFor="description">Description</Label>
					<Textarea
						id="description"
						value={plantData.description ?? ""}
						onChange={onChange}
						placeholder="Describe the plant scope, equipment area, or operating context."
					/>
				</div>

				<div className="flex justify-end md:col-span-2">
					<Button
						type="submit"
						className={appButtonVariants({ size: "form" })}
						disabled={createPlantLoading}
					>
						{createPlantLoading ? "Creating Plant" : "Create Plant"}
					</Button>
				</div>
			</form>
		</section>
	);
}

function ProcessUnitsStep() {
	return (
		<section className={appSurfaceVariants({ variant: "card" })}>
			<div className="mb-5 flex items-start gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-chip text-brand-control">
					<Network className="size-5" />
				</div>
				<div className="space-y-1">
					<h3 className={appTextVariants({ role: "cardTitle" })}>
						Create Process Units
					</h3>
					<p className={appTextVariants({ role: "helper" })}>
						Add reactors, tanks, clarifiers, membrane units, pump stations, or
						custom treatment stages for this plant.
					</p>
				</div>
			</div>

			<div className="grid gap-3 md:grid-cols-3">
				{["Influent", "Bioreactor", "Clarifier"].map((name) => (
					<div key={name} className="rounded-md border border-line-subtle bg-white/60 p-4">
						<p className="text-sm font-bold text-brand-ink">{name}</p>
						<p className="mt-1 text-xs leading-5 text-brand-muted">
							Draft process unit slot
						</p>
					</div>
				))}
			</div>
		</section>
	);
}

function DiagramLayoutStep() {
	return (
		<section className={appSurfaceVariants({ variant: "card" })}>
			<div className="mb-5 flex items-start gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-chip text-brand-control">
					<GitBranch className="size-5" />
				</div>
				<div className="space-y-1">
					<h3 className={appTextVariants({ role: "cardTitle" })}>Arrange Diagram</h3>
					<p className={appTextVariants({ role: "helper" })}>
						Position process units and prepare flow connections for the plant
						diagram workspace.
					</p>
				</div>
			</div>

			<div className="grid min-h-72 content-center gap-4 rounded-md border border-dashed border-line-subtle bg-white/45 p-5 md:grid-cols-3">
				{["Influent", "Treatment", "Effluent"].map((label) => (
					<div key={label} className="rounded-md border border-chip-line bg-chip p-4 text-center text-sm font-bold text-brand-control shadow-sm">
						{label}
					</div>
				))}
			</div>
		</section>
	);
}

function ReviewStep() {
	const reviewItems = useMemo(
		() => [
			"Plant record created",
			"Process units prepared",
			"Diagram layout arranged",
		],
		[],
	);

	return (
		<section className={appSurfaceVariants({ variant: "card" })}>
			<div className="mb-5 flex items-start gap-3">
				<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-chip text-brand-control">
					<Map className="size-5" />
				</div>
				<div className="space-y-1">
					<h3 className={appTextVariants({ role: "cardTitle" })}>Review Setup</h3>
					<p className={appTextVariants({ role: "helper" })}>
						Confirm the starter configuration before moving into the dashboard.
					</p>
				</div>
			</div>

			<ul className="space-y-3">
				{reviewItems.map((item) => (
					<li key={item} className="flex items-center gap-3 rounded-md border border-line-subtle bg-white/60 px-4 py-3 text-sm font-semibold text-brand-ink">
						<CheckCircle2 className="size-4 text-brand-control" />
						{item}
					</li>
				))}
			</ul>
		</section>
	);
}

function WizardSummary({ activeStep }: { activeStep: WizardStep }) {
	return (
		<aside className={appSurfaceVariants({ variant: "card" })}>
			<p className={appTextVariants({ role: "kicker" })}>Current step</p>
			<h3 className="mt-2 text-lg font-bold text-brand-ink">{activeStep.title}</h3>
			<p className="mt-2 text-sm leading-6 text-brand-muted">
				{activeStep.description}
			</p>
			<div className="mt-5 rounded-md border border-line-subtle bg-white/60 p-3 text-xs leading-5 text-brand-muted">
				Only authenticated ADMIN users can access this setup route. The parent
				authenticated route still validates the user session before this wizard
				renders.
			</div>
		</aside>
	);
}
