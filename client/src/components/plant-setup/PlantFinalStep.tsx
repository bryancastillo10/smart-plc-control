import { CheckCircle2, Circle, LoaderCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
	type PlantSetupRequestState,
	plantSetupRequests,
	useCreatePlantSetup,
} from "@/features/plant/useCreatePlantSetup";

const requestLabelKeys = {
	plant: "plantFinal.requests.plant",
	processUnits: "plantFinal.requests.processUnits",
	devices: "plantFinal.requests.devices",
	connections: "plantFinal.requests.connections",
	tags: "plantFinal.requests.tags",
	alertRules: "plantFinal.requests.alertRules",
	simulations: "plantFinal.requests.simulations",
} as const;
export default function PlantFinalStep() {
	const { t } = useTranslation("plantSetup");
	const requests = useCreatePlantSetup();

	return (
		<div aria-live="polite" className="space-y-2">
			{plantSetupRequests.map(({ id }) => (
				<StatusRow
					key={id}
					label={t(requestLabelKeys[id])}
					step={requests[id]}
				/>
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
	const { t } = useTranslation("plantSetup");
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
					<p className="text-xs text-brand-muted">
						{step.loading
							? step.total > 1
								? t("plantFinal.status.creatingProgress", {
										current: Math.min(step.completed + 1, step.total),
										total: step.total,
									})
								: t("plantFinal.status.creating")
							: step.status === "success"
								? step.total === 0
									? t("plantFinal.status.nothing")
									: t("plantFinal.status.completed", { count: step.completed })
								: step.status === "failed"
									? t("plantFinal.status.failed")
									: step.status === "skipped"
										? t("plantFinal.status.skipped")
										: t("plantFinal.status.waiting")}
					</p>
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
