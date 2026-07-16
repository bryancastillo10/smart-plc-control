import type { RefObject } from "react";

import {
	arrangementNodeHeight,
	arrangementNodeWidth,
} from "@/features/process_units/useProcessArrangementBoard";
import type { ProcessUnitConnection } from "@/types/process-unit-connection";
import type { ProcessUnit } from "@/types/process-unit";

interface ProcessConnectionLayerProps {
	connections: ProcessUnitConnection[];
	connectionPreviewRef: RefObject<SVGLineElement | null>;
	processUnits: ProcessUnit[];
}

export function ProcessConnectionLayer({
	connections,
	connectionPreviewRef,
	processUnits,
}: ProcessConnectionLayerProps) {
	const processUnitById = new Map(
		processUnits.map((unit) => [unit.id, unit]),
	);

	return (
		<svg
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 size-full"
		>
			<defs>
				<marker
					id="process-flow-arrow"
					markerHeight="8"
					markerWidth="8"
					orient="auto"
					refX="7"
					refY="4"
				>
					<path d="M0,0 L8,4 L0,8 Z" fill="currentColor" />
				</marker>
			</defs>
			{connections.map((connection) => {
				const source = processUnitById.get(connection.sourceUnitId);
				const target = processUnitById.get(connection.targetUnitId);
				if (!source || !target) return null;

				return (
					<line
						className="text-brand-control"
						key={connection.id}
						markerEnd="url(#process-flow-arrow)"
						stroke="currentColor"
						strokeWidth="2"
						x1={source.position.x + arrangementNodeWidth}
						x2={target.position.x}
						y1={source.position.y + arrangementNodeHeight / 2}
						y2={target.position.y + arrangementNodeHeight / 2}
					/>
				);
			})}
			<line
				className="text-brand-control"
				markerEnd="url(#process-flow-arrow)"
				ref={connectionPreviewRef}
				stroke="currentColor"
				strokeDasharray="6 4"
				strokeWidth="2"
				style={{ display: "none" }}
			/>
		</svg>
	);
}
