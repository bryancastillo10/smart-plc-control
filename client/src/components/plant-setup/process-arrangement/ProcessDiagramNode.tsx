import { CircleDot, GripVertical, type LucideIcon } from "lucide-react";
import type { PointerEvent as ReactPointerEvent } from "react";

import type { ProcessUnitPosition } from "@/types/process-unit";

interface ProcessDiagramNodeProps {
	Icon: LucideIcon;
	label: string;
	onConnectionStart?: (event: ReactPointerEvent<HTMLButtonElement>) => void;
	onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
	position: ProcessUnitPosition;
	subtitle: string;
	variant: "device" | "processUnit";
}

export function ProcessDiagramNode({
	Icon,
	label,
	onConnectionStart,
	onPointerDown,
	position,
	subtitle,
	variant,
}: ProcessDiagramNodeProps) {
	return (
		<div
			className={`absolute flex h-19 w-42 cursor-grab items-center gap-2 rounded-md border p-3 text-left shadow-md active:cursor-grabbing ${
				variant === "processUnit"
					? "border-chip-line bg-chip text-brand-control"
					: "border-blue-200 bg-blue-50 text-blue-700"
			}`}
			onPointerDown={onPointerDown}
			style={{ left: position.x, top: position.y }}
		>
			<GripVertical className="size-4 shrink-0 opacity-50" />
			<Icon className="size-5 shrink-0" />
			<span className="min-w-0">
				<span className="block truncate text-sm font-bold text-brand-ink">
					{label}
				</span>
				<span className="mt-1 block truncate text-xs font-semibold uppercase tracking-[0.08em] opacity-75">
					{subtitle}
				</span>
			</span>
			{onConnectionStart ? (
				<button
					aria-label={`Start process flow from ${label}`}
					className="absolute -right-3 flex size-7 cursor-crosshair items-center justify-center rounded-full border-2 border-white bg-brand-control text-white shadow-md hover:scale-110"
					onPointerDown={onConnectionStart}
					title="Drag to another process unit"
					type="button"
				>
					<CircleDot className="size-4" />
				</button>
			) : null}
		</div>
	);
}
