import { toast } from "sonner";

import { ApiFetchError } from "@/utils/fetch";

export function useToast() {
	return {
		success: (message: string) => toast.success(message),
		error: (error: unknown, fallback = "Request failed") =>
			toast.error(getToastErrorMessage(error, fallback)),
	};
}

function getToastErrorMessage(error: unknown, fallback: string) {
	if (error instanceof ApiFetchError) {
		return error.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return fallback;
}
