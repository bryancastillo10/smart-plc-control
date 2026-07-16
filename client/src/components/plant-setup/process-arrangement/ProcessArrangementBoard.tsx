import {
	Cable,
	Cpu,
	Cylinder,
	Factory,
	Gauge,
	RadioTower,
	Server,
	Waves,
	type LucideIcon,
} from "lucide-react";

import { ProcessConnectionLayer } from "@/components/plant-setup/process-arrangement/ProcessConnectionLayer";
import { ProcessDiagramNode } from "@/components/plant-setup/process-arrangement/ProcessDiagramNode";
import type { useProcessArrangementBoard } from "@/features/process_units/useProcessArrangementBoard";

const processUnitIconByName: Record<string, LucideIcon> = {
	Factory,
	Cylinder,
	Waves,
	Gauge,
};

const deviceIconByName: Record<string, LucideIcon> = {
	Cpu,
	Server,
	RadioTower,
	Gauge,
	Cable,
};

const getProcessUnitIcon = (iconName: string) =>
	processUnitIconByName[iconName] ?? Factory;

const getDeviceIcon = (iconName: string) => deviceIconByName[iconName] ?? Cpu;

type ProcessArrangementBoardProps = Pick<
	ReturnType<typeof useProcessArrangementBoard>,
	| "beginArrowDrag"
	| "beginNodeDrag"
	| "boardRef"
	| "cancelPointer"
	| "connectionPreviewRef"
	| "connections"
	| "devices"
	| "finishPointer"
	| "movePointer"
	| "processUnits"
>;

export function ProcessArrangementBoard({
	beginArrowDrag,
	beginNodeDrag,
	boardRef,
	cancelPointer,
	connectionPreviewRef,
	connections,
	devices,
	finishPointer,
	movePointer,
	processUnits,
}: ProcessArrangementBoardProps) {
	return (
		<div className="overflow-x-auto rounded-lg border border-line-subtle">
			<div
				className="relative h-130 min-w-180 touch-none select-none overflow-hidden bg-[radial-gradient(circle,var(--color-line-subtle)_1px,transparent_1px)]"
				onPointerCancel={cancelPointer}
				onPointerMove={movePointer}
				onPointerUp={finishPointer}
				ref={boardRef}
			>
				<ProcessConnectionLayer
					connectionPreviewRef={connectionPreviewRef}
					connections={connections}
					processUnits={processUnits}
				/>

				{processUnits.map((unit) => (
					<ProcessDiagramNode
						Icon={getProcessUnitIcon(unit.icon)}
						key={unit.id}
						label={unit.name}
						onConnectionStart={(event) =>
							beginArrowDrag(unit.id, unit.position, event)
						}
						onPointerDown={(event) =>
							beginNodeDrag("processUnit", unit.id, unit.position, event)
						}
						position={unit.position}
						subtitle={unit.type}
						variant="processUnit"
					/>
				))}

				{devices.map((device) => (
					<ProcessDiagramNode
						Icon={getDeviceIcon(device.icon)}
						key={device.id}
						label={device.name}
						onPointerDown={(event) =>
							beginNodeDrag("device", device.id, device.position, event)
						}
						position={device.position}
						subtitle={device.type.replaceAll("_", " ")}
						variant="device"
					/>
				))}

				{processUnits.length === 0 && devices.length === 0 ? (
					<div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-brand-muted">
						Add process units and devices before arranging the board.
					</div>
				) : null}
			</div>
		</div>
	);
}
