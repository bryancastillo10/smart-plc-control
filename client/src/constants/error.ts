export const statusErrorMessages: Record<number, string> = {
	400: "Invalid request. Please check your input.",
	401: "You need to sign in before continuing.",
	403: "You do not have permission to perform this action.",
	404: "The requested resource was not found.",
	405: "This action is not available.",
	409: "This request conflicts with existing data.",
	422: "Please check the submitted data.",
	429: "Too many requests. Please try again later.",
	500: "The server could not complete the request.",
	502: "The server is temporarily unavailable.",
	503: "The service is temporarily unavailable.",
};