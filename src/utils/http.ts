export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: TBody;
}

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "";

export async function http<TResponse = unknown, TBody = unknown>(
  url: string,
  options: HttpRequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", headers = {}, body } = options;

  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body != null ? JSON.stringify(body) : undefined,
    credentials: "include",
  };

  const requestUrl =
    url.startsWith("http") || (API_BASE && url.startsWith(String(API_BASE)))
      ? url
      : `${API_BASE}${url}`;
  const response = await fetch(requestUrl, init);
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    let errorPayload: unknown = undefined;
    if (contentType.includes("application/json")) {
      try {
        errorPayload = await response.json();
      } catch {}
    } else {
      try {
        errorPayload = await response.text();
      } catch {}
    }

    const message =
      (typeof errorPayload === "object" && errorPayload !== null && "message" in errorPayload
        ? errorPayload.message
        : undefined) || response.statusText || "Request failed";

    throw new Error(String(message));
  }

  if (contentType.includes("application/json")) {
    return (await response.json()) as TResponse;
  }

  return (await response.text()) as TResponse;
}

