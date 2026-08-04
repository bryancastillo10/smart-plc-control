import { ArrowRight, GitBranch, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ProcessArrangementBoard } from "@/components/plant-setup/process-arrangement/ProcessArrangementBoard";
import { Button } from "@/components/ui/button";
import { useProcessArrangementBoard } from "@/features/process_units/useProcessArrangementBoard";
import type { ProcessUnitFlowType } from "@/types/process-unit-connection";

const flowTypeLabelKeys = {
	WATER: "processArrangement.flowTypes.water",
	WASTEWATER: "processArrangement.flowTypes.wastewater",
	SLUDGE: "processArrangement.flowTypes.sludge",
	GAS: "processArrangement.flowTypes.gas",
	CHEMICAL: "processArrangement.flowTypes.chemical",
	RAW_MATERIAL: "processArrangement.flowTypes.rawMaterial",
	OTHERS: "processArrangement.flowTypes.others",
} as const satisfies Record<ProcessUnitFlowType, string>;


export function ProcessArrangementStep() {
	const { t } = useTranslation("plantSetup");
	const arrangement = useProcessArrangementBoard();
	const { connections, processUnits, removeConnection } = arrangement;
	const processUnitById = new Map(processUnits.map((unit) => [unit.id, unit]));

	return (
		<div className="space-y-6">
			<div className="rounded-md border border-line-subtle bg-white/60 p-3 text-sm leading-6 text-brand-muted">
				{t("processArrangement.instructions")}
			</div>

			<ProcessArrangementBoard {...arrangement} />

			<div className="space-y-3">
				<div className="flex items-center gap-2 font-bold text-brand-ink">
					<GitBranch className="size-4 text-brand-control" />
					{t("processArrangement.connectionsTitle", {
						count: connections.length,
					})}
				</div>
				{connections.length === 0 ? (
					<div className="rounded-md border border-dashed border-line-subtle p-5 text-center text-sm text-brand-muted">
						{t("processArrangement.empty")}
					</div>
				) : (
					<div className="grid gap-2 md:grid-cols-2">
						{connections.map((connection) => (
							<div
								className="flex items-center justify-between gap-3 rounded-md border border-chip-line bg-chip p-3"
								key={connection.id}
							>
								<div className="min-w-0 text-sm">
									<div className="flex items-center gap-2 font-bold text-brand-ink">
										<span className="truncate">
											{processUnitById.get(connection.sourceUnitId)?.name}
										</span>
										<ArrowRight className="size-4 shrink-0" />
										<span className="truncate">
											{processUnitById.get(connection.targetUnitId)?.name}
										</span>
									</div>
									<p className="mt-1 text-xs text-brand-muted">
										{connection.flowType
											? t(flowTypeLabelKeys[connection.flowType])
											: null}
									</p>
								</div>
								<Button
									aria-label={t("processArrangement.remove")}
									onClick={() => removeConnection(connection.id)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
