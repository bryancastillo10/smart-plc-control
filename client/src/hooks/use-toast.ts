import { useRef } from "react";
import { create } from "zustand";

import type { ToastItem, ToastStatus } from "@/components/ui/toast";

type ToastInput = {
	title?: string;
	message: string;
	status?: ToastStatus;
	duration?: number;
};

type ToastState = {
	toasts: ToastItem[];
	push: (toast: ToastInput) => string;
	dismiss: (id: string) => void;
};

const DEFAULT_DURATION = 4000;

const timeoutMap = new Map<string, ReturnType<typeof setTimeout>>();

export const useToastStore = create<ToastState>((set) => ({
	toasts: [],
	push: ({ title, message, status = "info", duration = DEFAULT_DURATION }) => {
		const id = crypto.randomUUID();
		const nextToast: ToastItem = {
			id,
			title,
			message,
			status,
			duration,
		};

		set((state) => ({
			toasts: [...state.toasts, nextToast],
		}));

		const timeoutId = setTimeout(() => {
			timeoutMap.delete(id);
			set((state) => ({
				toasts: state.toasts.filter((toast) => toast.id !== id),
			}));
		}, duration);

		timeoutMap.set(id, timeoutId);

		return id;
	},
	dismiss: (id) => {
		const timeoutId = timeoutMap.get(id);
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutMap.delete(id);
		}

		set((state) => ({
			toasts: state.toasts.filter((toast) => toast.id !== id),
		}));
	},
}));

export function useToast() {
	const push = useToastStore((state) => state.push);
	const dismiss = useToastStore((state) => state.dismiss);
	const latestToastId = useRef<string | null>(null);

	const toast = (input: ToastInput) => {
		const id = push(input);
		latestToastId.current = id;
		return id;
	};

	return {
		toast,
		success: (message: string, title = "Success") =>
			toast({ message, status: "success", title }),
		error: (message: string, title = "Error") =>
			toast({ message, status: "error", title }),
		info: (message: string, title = "Notice") =>
			toast({ message, status: "info", title }),
		dismiss,
		dismissLatest: () => {
			if (latestToastId.current) {
				dismiss(latestToastId.current);
				latestToastId.current = null;
			}
		},
	};
}
