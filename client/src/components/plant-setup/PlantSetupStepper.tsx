import { CheckCircle2, Circle, CircleDot } from "lucide-react";

import type {
	PlantSetupStep,
	PlantSetupStepId,
} from "@/features/plant/type";
import { cn } from "@/utils/utils";

interface PlantSetupStepperProps {
	activeStepId: PlantSetupStepId;
	activeStepIndex: number;
	onSelectStep: (stepId: PlantSetupStepId) => void;
	steps: readonly PlantSetupStep[];
}

export function PlantSetupStepper({
	activeStepId,
	activeStepIndex,
	onSelectStep,
	steps,
}: PlantSetupStepperProps) {
	return (
		<nav
			aria-label="Plant setup workflow"
			className="grid grid-cols-5 gap-2 overflow-x-auto"
		>
			{steps.map((step, index) => {
				const isActive = step.id === activeStepId;
				const isComplete = index < activeStepIndex;
				const StepIcon = isActive
					? CircleDot
					: isComplete
						? CheckCircle2
						: Circle;

				return (
					<button
						aria-current={isActive ? "step" : undefined}
						className={cn(
							"flex items-center gap-2 rounded-md border px-2 py-2 text-left transition-colors",
							isActive
								? "border-brand-control bg-chip text-brand-ink shadow-sm"
								: "border-line-subtle bg-white/55 text-brand-muted hover:bg-chip",
						)}
						key={step.id}
						onClick={() => onSelectStep(step.id)}
						type="button"
					>
						<span className="text-[0.68rem] font-bold leading-none text-brand-kicker">
							{String(index + 1).padStart(2, "0")}
						</span>
						<span className="shrink-0 text-brand-control">
							<StepIcon className="size-4" />
						</span>
						<span className="truncate text-xs font-bold leading-4">
							{step.title}
						</span>
					</button>
				);
			})}
		</nav>
	);
}