const DEFAULT_API_BASE_PATH = "/api/v1";
const DEFAULT_CONTENT_TYPE = "application/json";

export interface ApiFetchOptions<TBody = unknown>
	extends Omit<RequestInit, "body" | "headers"> {
	baseUrl?: string;
	body?: TBody | BodyInit | null;
	contentType?: string | null;
	headers?: HeadersInit;
}

export class ApiFetchError<TPayload = unknown> extends Error {
	constructor(
		public response: Response,
		public payload: TPayload | null,
	) {
		super(getErrorMessage(response, payload));
		this.name = "ApiFetchError";
	}

	get status() {
		return this.response.status;
	}
}

export async function apiFetch<TResponse = unknown, TBody = unknown>(
	path: string,
	options: ApiFetchOptions<TBody> = {},
): Promise<TResponse> {
	const {
		baseUrl = DEFAULT_API_BASE_PATH,
		body,
		contentType = DEFAULT_CONTENT_TYPE,
		headers,
		...requestOptions
	} = options;

	const requestHeaders = new Headers(headers);
	const isFormDataBody = isFormData(body);
	const requestBody = isRequestBody(body) ? body : JSON.stringify(body);

	if (!requestHeaders.has("Accept")) {
		requestHeaders.set("Accept", DEFAULT_CONTENT_TYPE);
	}

	if (
		body !== undefined &&
		body !== null &&
		contentType !== null &&
		!isFormDataBody &&
		!requestHeaders.has("Content-Type")
	) {
		requestHeaders.set("Content-Type", contentType);
	}

	const response = await fetch(createUrl(baseUrl, path), {
		...requestOptions,
		headers: requestHeaders,
		body: body === undefined || body === null ? undefined : requestBody,
	});
	const payload = await response.json().catch(() => null);

	if (!response.ok) {
		throw new ApiFetchError(response, payload);
	}

	return payload as TResponse;
}

function createUrl(baseUrl: string, path: string) {
	if (path.startsWith("http://") || path.startsWith("https://")) {
		return path;
	}

	return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function isRequestBody(body: unknown): body is BodyInit {
	return (
		typeof body === "string" ||
		isFormData(body) ||
		(typeof Blob !== "undefined" && body instanceof Blob) ||
		(typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) ||
		(typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer)
	);
}

function isFormData(body: unknown): body is FormData {
	return typeof FormData !== "undefined" && body instanceof FormData;
}

function getErrorMessage(response: Response, payload: unknown) {
	if (payload && typeof payload === "object") {
		if ("error" in payload && typeof payload.error === "string") {
			return payload.error;
		}

		if ("message" in payload && typeof payload.message === "string") {
			return payload.message;
		}
	}

	return `Request failed with status ${response.status}`;
}
