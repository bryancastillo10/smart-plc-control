import { useEffect, useState } from "react";

import type { PlcSensorReading, PlcStreamStatus } from "@/types/plc";

const MAX_HISTORY = 12;
const RETRY_DELAY_MS = 3_000;

function getPlcStreamUrl() {
	if (typeof window === "undefined") {
		return null;
	}

	const url = new URL("/ws/plc", window.location.origin);
	url.protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

	return url.toString();
}

function isPlcSensorReading(value: unknown): value is PlcSensorReading {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const reading = value as Record<string, unknown>;

	return (
		typeof reading.timestamp === "string" &&
		typeof reading.flowRate === "number" &&
		typeof reading.pH === "number" &&
		typeof reading.turbidity === "number" &&
		typeof reading.dissolvedOxygen === "number" &&
		typeof reading.temperature === "number"
	);
}

const usePlcStream = () => {
	const [history, setHistory] = useState<PlcSensorReading[]>([]);
	const [status, setStatus] = useState<PlcStreamStatus>("connecting");
	const [error, setError] = useState<string | null>(null);
	const [packetsReceived, setPacketsReceived] = useState(0);

	useEffect(() => {
		const streamUrl = getPlcStreamUrl();

		if (!streamUrl) {
			return;
		}

		let reconnectTimer: number | null = null;
		let socket: WebSocket | null = null;
		let disposed = false;

		const connect = () => {
			setStatus("connecting");
			socket = new WebSocket(streamUrl);

			socket.onopen = () => {
				if (disposed) {
					return;
				}

				setStatus("open");
				setError(null);
			};

			socket.onmessage = (event) => {
				if (disposed) {
					return;
				}

				try {
					const payload = JSON.parse(String(event.data)) as unknown;

					if (!isPlcSensorReading(payload)) {
						throw new Error("Received malformed PLC payload.");
					}

					setHistory((currentHistory) => [
						...currentHistory.slice(-(MAX_HISTORY - 1)),
						payload,
					]);
					setPacketsReceived((count) => count + 1);
					setError(null);
				} catch (streamError) {
					setStatus("error");
					setError(
						streamError instanceof Error
							? streamError.message
							: "Received malformed PLC payload.",
					);
				}
			};

			socket.onerror = () => {
				if (disposed) {
					return;
				}

				setStatus("error");
				setError("Unable to read the PLC websocket stream.");
			};

			socket.onclose = () => {
				if (disposed) {
					return;
				}

				setStatus((currentStatus) =>
					currentStatus === "error" ? "error" : "closed",
				);
				reconnectTimer = window.setTimeout(connect, RETRY_DELAY_MS);
			};
		};

		connect();

		return () => {
			disposed = true;

			if (reconnectTimer !== null) {
				window.clearTimeout(reconnectTimer);
			}

			socket?.close();
		};
	}, []);

	const currentReading = history[history.length - 1] ?? null;

	return {
		currentReading,
		error,
		hasData: history.length > 0,
		history,
		lastUpdatedAt: currentReading?.timestamp ?? null,
		packetsReceived,
		status,
	};
};

export default usePlcStream;
