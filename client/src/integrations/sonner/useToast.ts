import { toast } from "sonner";

import { getErrorMessage } from "@/utils/error";

export function useToast() {
	return {
		loading: (message: string) => toast.loading(message),
		success: (message: string) => toast.success(message),
		error: (error: unknown, fallback = "Request failed") =>
			toast.error(getErrorMessage(error, fallback)),
		dismiss: (toastId?: string | number) => toast.dismiss(toastId),
	};
}
