import { ArrowRight, GitBranch, Trash2 } from "lucide-react";

import { ProcessArrangementBoard } from "@/components/plant-setup/process-arrangement/ProcessArrangementBoard";
import { Button } from "@/components/ui/button";
import { useProcessArrangementBoard } from "@/features/process_units/useProcessArrangementBoard";

export function ProcessArrangementStep() {
	const arrangement = useProcessArrangementBoard();
	const {
		connections,
		processUnits,
		removeConnection,
	} = arrangement;
	const processUnitById = new Map(
		processUnits.map((unit) => [unit.id, unit]),
	);

	return (
		<div className="space-y-6">
			<div className="rounded-md border border-line-subtle bg-white/60 p-3 text-sm leading-6 text-brand-muted">
				Drag each card to arrange the plant. To create a process flow, drag the
				arrow handle on the right side of one process unit and release it over
				another process unit.
			</div>

			<ProcessArrangementBoard {...arrangement} />

			<div className="space-y-3">
				<div className="flex items-center gap-2 font-bold text-brand-ink">
					<GitBranch className="size-4 text-brand-control" />
					Process Flow Connections ({connections.length})
				</div>
				{connections.length === 0 ? (
					<div className="rounded-md border border-dashed border-line-subtle p-5 text-center text-sm text-brand-muted">
						No process-flow connections have been added yet.
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
										{connection.flowType?.replaceAll("_", " ")}
									</p>
								</div>
								<Button
									aria-label="Remove process connection"
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
