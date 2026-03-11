import { Toast } from "@/components/ui/toast";
import { useToastStore } from "@/hooks/use-toast";

export function Toaster() {
	const toasts = useToastStore((state) => state.toasts);
	const dismiss = useToastStore((state) => state.dismiss);

	if (toasts.length === 0) {
		return null;
	}

	return (
		<div className="pointer-events-none fixed right-8 top-20 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
			{toasts.map((toast) => (
				<Toast key={toast.id} toast={toast} onDismiss={dismiss} />
			))}
		</div>
	);
}
