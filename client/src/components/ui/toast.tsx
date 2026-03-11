import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import type React from "react";

import { cn } from "@/lib/utils";

export type ToastStatus = "success" | "error" | "info";

export type ToastItem = {
	id: string;
	title?: string;
	message: string;
	status: ToastStatus;
	duration: number;
};

type ToastProps = {
	toast: ToastItem;
	onDismiss: (id: string) => void;
};

const iconMap = {
	success: CheckCircle2,
	error: CircleAlert,
	info: Info,
} satisfies Record<ToastStatus, React.ComponentType<{ className?: string }>>;

const containerVariants = {
	success:
		"border-emerald-500/40 bg-emerald-500/10 text-emerald-50 shadow-emerald-950/30",
	error: "border-rose-500/40 bg-rose-500/10 text-rose-50 shadow-rose-950/30",
	info: "border-cyan-500/40 bg-cyan-500/10 text-cyan-50 shadow-cyan-950/30",
} satisfies Record<ToastStatus, string>;

const iconVariants = {
	success: "text-emerald-300",
	error: "text-rose-300",
	info: "text-cyan-300",
} satisfies Record<ToastStatus, string>;

export function Toast({ toast, onDismiss }: ToastProps) {
	const Icon = iconMap[toast.status];

	return (
		<div
			className={cn(
				"pointer-events-auto flex w-full items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm",
				containerVariants[toast.status],
			)}
		>
			<Icon
				className={cn("mt-0.5 size-5 shrink-0", iconVariants[toast.status])}
			/>
			<div className="min-w-0 flex-1">
				{toast.title ? (
					<p className="text-sm font-semibold tracking-tight">{toast.title}</p>
				) : null}
				<p className="text-sm opacity-90">{toast.message}</p>
			</div>
			<button
				aria-label="Dismiss notification"
				className="rounded-md p-1 opacity-70 transition hover:bg-white/10 hover:opacity-100"
				onClick={() => onDismiss(toast.id)}
				type="button"
			>
				<X className="size-4" />
			</button>
		</div>
	);
}
