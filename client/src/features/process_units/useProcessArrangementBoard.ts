import {
	type PointerEvent as ReactPointerEvent,
	useEffect,
	useRef,
} from "react";

import { useCreateProcessUnitConnection } from "@/features/process_units/useCreateProcessUnitConnection";
import type { ProcessUnitPosition } from "@/types/process-unit";

export const arrangementNodeWidth = 168;
export const arrangementNodeHeight = 76;

type ArrangementNodeKind = "device" | "processUnit";

type DraggedNode = {
	id: string;
	kind: ArrangementNodeKind;
	offsetX: number;
	offsetY: number;
};

export function useProcessArrangementBoard() {
	const connectionWorkflow = useCreateProcessUnitConnection();
	const {
		beginConnection,
		cancelConnection,
		createConnection,
		moveDevice,
		moveProcessUnit,
		processUnits,
	} = connectionWorkflow;
	const boardRef = useRef<HTMLDivElement>(null);
	const draggedNodeRef = useRef<DraggedNode | null>(null);
	const connectionSourceRef = useRef<string | null>(null);
	const connectionPreviewRef = useRef<SVGLineElement>(null);
	const pendingPositionRef = useRef<ProcessUnitPosition | null>(null);
	const animationFrameRef = useRef<number | null>(null);

	useEffect(
		() => () => {
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		},
		[],
	);

	const beginNodeDrag = (
		kind: ArrangementNodeKind,
		id: string,
		position: ProcessUnitPosition,
		event: ReactPointerEvent<HTMLDivElement>,
	) => {
		const board = boardRef.current;
		if (!board) return;

		const bounds = board.getBoundingClientRect();
		draggedNodeRef.current = {
			id,
			kind,
			offsetX: event.clientX - bounds.left - position.x,
			offsetY: event.clientY - bounds.top - position.y,
		};
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const beginArrowDrag = (
		sourceUnitId: string,
		position: ProcessUnitPosition,
		event: ReactPointerEvent<HTMLButtonElement>,
	) => {
		event.stopPropagation();
		connectionSourceRef.current = sourceUnitId;
		beginConnection(sourceUnitId);

		const preview = connectionPreviewRef.current;
		if (preview) {
			const startX = position.x + arrangementNodeWidth;
			const startY = position.y + arrangementNodeHeight / 2;
			preview.setAttribute("x1", String(startX));
			preview.setAttribute("y1", String(startY));
			preview.setAttribute("x2", String(startX));
			preview.setAttribute("y2", String(startY));
			preview.style.display = "block";
		}

		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const movePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
		const board = boardRef.current;
		if (!board) return;

		const bounds = board.getBoundingClientRect();
		if (connectionSourceRef.current) {
			const preview = connectionPreviewRef.current;
			preview?.setAttribute("x2", String(event.clientX - bounds.left));
			preview?.setAttribute("y2", String(event.clientY - bounds.top));
			return;
		}

		const draggedNode = draggedNodeRef.current;
		if (!draggedNode) return;

		pendingPositionRef.current = {
			x: Math.max(
				0,
				Math.min(
					bounds.width - arrangementNodeWidth,
					event.clientX - bounds.left - draggedNode.offsetX,
				),
			),
			y: Math.max(
				0,
				Math.min(
					bounds.height - arrangementNodeHeight,
					event.clientY - bounds.top - draggedNode.offsetY,
				),
			),
		};

		if (animationFrameRef.current !== null) return;
		animationFrameRef.current = requestAnimationFrame(() => {
			const position = pendingPositionRef.current;
			const activeNode = draggedNodeRef.current;
			if (position && activeNode) {
				if (activeNode.kind === "processUnit") {
					moveProcessUnit(activeNode.id, position);
				} else {
					moveDevice(activeNode.id, position);
				}
			}
			animationFrameRef.current = null;
		});
	};

	const finishPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
		const board = boardRef.current;
		const sourceUnitId = connectionSourceRef.current;
		if (board && sourceUnitId) {
			const bounds = board.getBoundingClientRect();
			const point = {
				x: event.clientX - bounds.left,
				y: event.clientY - bounds.top,
			};
			const target = processUnits.find(
				(unit) =>
					unit.id !== sourceUnitId &&
					point.x >= unit.position.x &&
					point.x <= unit.position.x + arrangementNodeWidth &&
					point.y >= unit.position.y &&
					point.y <= unit.position.y + arrangementNodeHeight,
			);

			if (target) {
				createConnection(sourceUnitId, target.id);
			} else {
				cancelConnection();
			}
		}

		resetPointerInteraction();
	};

	const resetPointerInteraction = () => {
		connectionSourceRef.current = null;
		draggedNodeRef.current = null;
		pendingPositionRef.current = null;
		if (connectionPreviewRef.current) {
			connectionPreviewRef.current.style.display = "none";
		}
	};

	const cancelPointer = () => {
		cancelConnection();
		resetPointerInteraction();
	};

	return {
		...connectionWorkflow,
		beginArrowDrag,
		beginNodeDrag,
		boardRef,
		cancelPointer,
		connectionPreviewRef,
		finishPointer,
		movePointer,
	};
}

export default useProcessArrangementBoard;
