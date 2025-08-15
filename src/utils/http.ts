import { getValidToken } from './auth';

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: TBody;
  skipAuth?: boolean; // 인증이 필요 없는 요청을 위한 옵션
}

// 프록시를 사용하도록 설정
const API_BASE = "";

export async function http<TResponse = unknown, TBody = unknown>(
  url: string,
  options: HttpRequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", headers = {}, body, skipAuth = false } = options;

  // Authorization 헤더에 토큰 추가 (skipAuth가 false일 때만)
  const authHeaders: Record<string, string> = { ...headers };
  if (!skipAuth) {
    const token = getValidToken();
    console.log('🔐 Token check:', { 
      skipAuth, 
      hasToken: !!token, 
      tokenLength: token?.length,
      url 
    });
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
      console.log('✅ Authorization header added');
    } else {
      console.log('❌ No valid token found');
    }
  } else {
    console.log('🚫 Auth skipped for:', url);
  }

  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
    },
    body: body != null ? JSON.stringify(body) : undefined,
    credentials: "include",
  };

  // 프록시를 사용하여 상대 경로로 요청
  const requestUrl = url.startsWith("http") ? url : url;
  
  console.log('🌐 Request details:', {
    method,
    url: requestUrl,
    headers: authHeaders,
    skipAuth
  });

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

    console.error('❌ Request failed:', {
      status: response.status,
      statusText: response.statusText,
      message,
      errorPayload
    });

    throw new Error(String(message));
  }

  if (contentType.includes("application/json")) {
    return (await response.json()) as TResponse;
  }

  return (await response.text()) as TResponse;
}

