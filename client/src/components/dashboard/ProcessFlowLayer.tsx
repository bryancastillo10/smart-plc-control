import type {
	ProcessOverviewConnection,
	ProcessOverviewUnit,
} from "@/constants/process_overview";

interface ProcessFlowLayerProps {
	connections: readonly ProcessOverviewConnection[];
	unitHeight: number;
	units: readonly ProcessOverviewUnit[];
	unitWidth: number;
}

const ProcessFlowLayer = ({
	connections,
	unitHeight,
	units,
	unitWidth,
}: ProcessFlowLayerProps) => {
	const unitById = new Map(units.map((unit) => [unit.id, unit]));

	return (
		<svg
			aria-label="Process flow connections"
			className="pointer-events-none absolute inset-0 size-full text-brand-control"
			role="img"
		>
			<defs>
				<marker
					id="dashboard-process-flow-arrow"
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
				const source = unitById.get(connection.sourceUnitId);
				const target = unitById.get(connection.targetUnitId);

				if (!source || !target) {
					return null;
				}

				const flowsRight = target.position.x >= source.position.x;
				const sourceX = source.position.x + (flowsRight ? unitWidth : 0);
				const targetX = target.position.x + (flowsRight ? 0 : unitWidth);

				return (
					<g key={connection.id}>
						<title>{connection.label}</title>
						<line
							markerEnd="url(#dashboard-process-flow-arrow)"
							stroke="currentColor"
							strokeWidth="2"
							x1={sourceX}
							x2={targetX}
							y1={source.position.y + unitHeight / 2}
							y2={target.position.y + unitHeight / 2}
						/>
					</g>
				);
			})}
		</svg>
	);
};

export default ProcessFlowLayer;
