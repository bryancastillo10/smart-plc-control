import { CheckCircle2, Circle, LoaderCircle, XCircle } from "lucide-react";

import {
	type PlantSetupRequestState,
	plantSetupRequests,
	useCreatePlantSetup,
} from "@/features/plant/useCreatePlantSetup";

export default function PlantFinalStep() {
	const requests = useCreatePlantSetup();

	return (
		<div aria-live="polite" className="space-y-2">
			{plantSetupRequests.map(({ id, label }) => (
				<StatusRow key={id} label={label} step={requests[id]} />
			))}
		</div>
	);
}

function StatusRow({
	label,
	step,
}: {
	label: string;
	step: PlantSetupRequestState;
}) {
	const Icon = step.loading
		? LoaderCircle
		: step.status === "success"
			? CheckCircle2
			: step.status === "failed"
				? XCircle
				: Circle;
	const color =
		step.status === "success"
			? "text-emerald-600"
			: step.status === "failed"
				? "text-red-600"
				: "text-brand-control";

	return (
		<div className="rounded-md border border-line-subtle bg-white/60 p-3">
			<div className="flex items-center gap-3">
				<Icon
					className={`${color} size-5 shrink-0 ${step.loading ? "animate-spin" : ""}`}
				/>
				<div>
					<p className="text-sm font-semibold text-brand-ink">{label}</p>
					<p className="text-xs text-brand-muted">{statusText(step)}</p>
				</div>
			</div>
			{step.error ? (
				<p className="mt-2 rounded bg-red-50 px-2 py-1 text-xs text-red-700">
					{step.error}
				</p>
			) : null}
		</div>
	);
}

function statusText(step: PlantSetupRequestState) {
	if (step.loading) {
		return step.total > 1
			? "Creating " +
					Math.min(step.completed + 1, step.total) +
					" of " +
					step.total +
					"..."
			: "Creating...";
	}
	if (step.status === "success") {
		if (step.total === 0) return "Nothing to create";
		return `${step.completed} request${step.completed === 1 ? "" : "s"} completed`;
	}
	if (step.status === "failed") return "Request failed";
	if (step.status === "skipped") return "Skipped after an earlier failure";
	return "Waiting";
}
