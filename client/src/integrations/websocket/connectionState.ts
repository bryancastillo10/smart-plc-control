export type WebSocketConnectionState =
	| "connecting"
	| "open"
	| "reconnecting"
	| "closed"
	| "error";

export const MAX_RECONNECT_DELAY_MS = 30_000;
export const INITIAL_RECONNECT_DELAY_MS = 1_000;

export function getReconnectDelayMs(attempt: number) {
	const normalizedAttempt = Math.max(0, Math.floor(attempt));
	return Math.min(
		INITIAL_RECONNECT_DELAY_MS * 2 ** normalizedAttempt,
		MAX_RECONNECT_DELAY_MS,
	);
}
