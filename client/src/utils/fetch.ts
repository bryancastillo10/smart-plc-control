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
	status: number;
	payload: TPayload | null;
	response: Response;

	constructor(response: Response, payload: TPayload | null) {
		super(getErrorMessage(response, payload));
		this.name = "ApiFetchError";
		this.status = response.status;
		this.payload = payload;
		this.response = response;
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
		headers: customHeaders,
		...requestOptions
	} = options;

	const headers = new Headers(customHeaders);
	const requestBody = buildRequestBody(body);

	if (!headers.has("Accept")) {
		headers.set("Accept", DEFAULT_CONTENT_TYPE);
	}

	if (
		requestBody !== undefined &&
		contentType !== null &&
		!headers.has("Content-Type") &&
		!isFormData(body)
	) {
		headers.set("Content-Type", contentType);
	}

	const response = await fetch(buildUrl(baseUrl, path), {
		...requestOptions,
		headers,
		body: requestBody,
	});

	const payload = await parseJsonResponse(response);

	if (!response.ok) {
		throw new ApiFetchError(response, payload);
	}

	return payload as TResponse;
}

function buildRequestBody(body: unknown): BodyInit | undefined {
	if (body === undefined || body === null) {
		return undefined;
	}

	if (isBodyInit(body)) {
		return body;
	}

	return JSON.stringify(body);
}

async function parseJsonResponse(response: Response): Promise<unknown | null> {
	if (response.status === 204 || response.status === 205) {
		return null;
	}

	const text = await response.text();

	if (!text) {
		return null;
	}

	return JSON.parse(text);
}

function buildUrl(baseUrl: string, path: string) {
	if (/^https?:\/\//.test(path)) {
		return path;
	}

	return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

function getErrorMessage(response: Response, payload: unknown) {
	if (
		payload &&
		typeof payload === "object" &&
		"error" in payload &&
		typeof payload.error === "string"
	) {
		return payload.error;
	}

	if (
		payload &&
		typeof payload === "object" &&
		"message" in payload &&
		typeof payload.message === "string"
	) {
		return payload.message;
	}

	return `Request failed with status ${response.status}`;
}

function isBodyInit(body: unknown): body is BodyInit {
	return (
		typeof body === "string" ||
		isFormData(body) ||
		isBlob(body) ||
		isUrlSearchParams(body) ||
		isArrayBuffer(body) ||
		ArrayBuffer.isView(body) ||
		isReadableStream(body)
	);
}

function isFormData(body: unknown): body is FormData {
	return typeof FormData !== "undefined" && body instanceof FormData;
}

function isBlob(body: unknown): body is Blob {
	return typeof Blob !== "undefined" && body instanceof Blob;
}

function isUrlSearchParams(body: unknown): body is URLSearchParams {
	return (
		typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams
	);
}

function isArrayBuffer(body: unknown): body is ArrayBuffer {
	return typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer;
}

function isReadableStream(body: unknown): body is ReadableStream {
	return (
		typeof ReadableStream !== "undefined" && body instanceof ReadableStream
	);
}
