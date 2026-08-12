import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { simulationQueryKeys } from "@/features/simulations/queries";
import { simulationStreamQueryKeys } from "@/features/simulations/streamQueryKeys";
import { parseSimulationStreamMessage } from "@/features/simulations/websocketTypes";
import {
	createSimulationSocketUrl,
	getReconnectDelayMs,
	type WebSocketConnectionState,
} from "@/integrations/websocket";
import type { SimulationStatus } from "@/types/enum";

const DEFAULT_INTERVAL_MS = 1_000;
const MINIMUM_STALE_TIMEOUT_MS = 5_000;

export interface UseSimulationStreamOptions {
	plantId?: string;
	status?: SimulationStatus;
	intervalMs?: number;
}

export interface SimulationStreamState {
	connectionState: WebSocketConnectionState;
	error: string | null;
	isStale: boolean;
	lastMessageAt: string | null;
}

const initialState: SimulationStreamState = {
	connectionState: "closed",
	error: null,
	isStale: false,
	lastMessageAt: null,
};

export function useSimulationStream({
	plantId,
	status,
	intervalMs = DEFAULT_INTERVAL_MS,
}: UseSimulationStreamOptions): SimulationStreamState {
	const queryClient = useQueryClient();
	const [streamState, setStreamState] =
		useState<SimulationStreamState>(initialState);

	useEffect(() => {
		if (!plantId) {
			setStreamState(initialState);
			return;
		}

		let socket: WebSocket | undefined;
		let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
		let staleTimer: ReturnType<typeof setTimeout> | undefined;
		let reconnectAttempt = 0;
		let hasOpened = false;
		let disposed = false;

		const listFilters = status ? { plantId, status } : { plantId };
		const staleTimeoutMs = Math.max(intervalMs * 3, MINIMUM_STALE_TIMEOUT_MS);

		const clearStaleTimer = () => {
			if (staleTimer !== undefined) clearTimeout(staleTimer);
			staleTimer = undefined;
		};

		const armStaleTimer = (activeSocket: WebSocket) => {
			clearStaleTimer();
			staleTimer = setTimeout(() => {
				if (disposed || socket !== activeSocket) return;

				setStreamState((current) => ({
					...current,
					connectionState: "reconnecting",
					error: "Simulation stream became stale.",
					isStale: true,
				}));
				activeSocket.close();
			}, staleTimeoutMs);
		};

		const connect = () => {
			if (disposed) return;

			setStreamState((current) =>
				hasOpened
					? { ...current, connectionState: "reconnecting" }
					: { ...initialState, connectionState: "connecting" },
			);

			const activeSocket = new WebSocket(
				createSimulationSocketUrl({ plantId, status, intervalMs }),
			);
			socket = activeSocket;

			activeSocket.addEventListener("open", () => {
				if (disposed || socket !== activeSocket) return;

				hasOpened = true;
				reconnectAttempt = 0;
				setStreamState((current) => ({
					...current,
					connectionState: "open",
					error: null,
					isStale: false,
				}));
				armStaleTimer(activeSocket);
			});

			activeSocket.addEventListener("message", (event) => {
				if (
					disposed ||
					socket !== activeSocket ||
					typeof event.data !== "string"
				) {
					return;
				}

				const result = parseSimulationStreamMessage(event.data);
				if (!result.success) return;

				const message = result.data;
				if (message.error) {
					setStreamState((current) => ({
						...current,
						connectionState: "error",
						error: message.error ?? null,
					}));
					return;
				}

				if (!message.data) return;

				if (message.type === "simulation.snapshot") {
					if (
						message.data.some((simulation) => simulation.plantId !== plantId)
					) {
						return;
					}

					queryClient.setQueryData(
						simulationQueryKeys.list(listFilters),
						message.data,
					);
					for (const simulation of message.data) {
						queryClient.setQueryData(
							simulationQueryKeys.detail(simulation.id),
							simulation,
						);
					}
				} else {
					if (message.data.plantId !== plantId) return;
					queryClient.setQueryData(
						simulationStreamQueryKeys.telemetry(plantId),
						message.data,
					);
				}

				armStaleTimer(activeSocket);
				setStreamState({
					connectionState: "open",
					error: null,
					isStale: false,
					lastMessageAt: message.sentAt,
				});
			});

			activeSocket.addEventListener("error", () => {
				if (disposed || socket !== activeSocket) return;
				setStreamState((current) => ({
					...current,
					connectionState: "error",
					error: "Unable to connect to the simulation stream.",
				}));
			});

			activeSocket.addEventListener("close", () => {
				if (disposed || socket !== activeSocket) return;

				clearStaleTimer();
				socket = undefined;
				setStreamState((current) => ({
					...current,
					connectionState: "reconnecting",
				}));

				const delayMs = getReconnectDelayMs(reconnectAttempt);
				reconnectAttempt += 1;
				reconnectTimer = setTimeout(connect, delayMs);
			});
		};

		connect();

		return () => {
			disposed = true;
			if (reconnectTimer !== undefined) clearTimeout(reconnectTimer);
			clearStaleTimer();
			socket?.close();
		};
	}, [intervalMs, plantId, queryClient, status]);

	return streamState;
}
