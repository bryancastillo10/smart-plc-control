import { toast } from "sonner";

import { getErrorMessage } from "@/utils/error";

export function useToast() {
	return {
		success: (message: string) => toast.success(message),
		error: (error: unknown, fallback = "Request failed") =>
			toast.error(getErrorMessage(error, fallback)),
	};
}
