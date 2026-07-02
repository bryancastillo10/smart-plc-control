import { statusErrorMessages } from "@/constants/error";
import { ApiFetchError } from "@/utils/fetch";

const defaultErrorMessage = "Request failed";


export function getErrorMessage(
	error: unknown,
	fallback = defaultErrorMessage,
) {
	if (error instanceof ApiFetchError) {
		return error.message || statusErrorMessages[error.status] || fallback;
	}

	if (error instanceof Error) {
		return error.message || fallback;
	}

	if (typeof error === "string") {
		return error;
	}

	return fallback;
}
