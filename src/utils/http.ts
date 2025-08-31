import { getValidToken, saveToken, removeToken } from './auth';

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpRequestOptions<TBody = unknown> {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: TBody;
  skipAuth?: boolean; // 인증이 필요 없는 요청을 위한 옵션
  retryOn401?: boolean; // 401 발생 시 자동 재시도 (기본: true)
}

// const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "";
const API_BASE = "https://api.ctrlu.site";

async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshUrl = `${API_BASE}/auth/reissue`;
    const res = await fetch(refreshUrl, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || '';
    let data: any = null;
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      try { data = JSON.parse(await res.text()); } catch { data = null; }
    }

    const token = data?.result?.accessToken || data?.accessToken || null;
    if (token) {
      saveToken(token, 300);
      return token;
    }
    return null;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
}

export async function http<TResponse = unknown, TBody = unknown>(
  url: string,
  options: HttpRequestOptions<TBody> = {}
): Promise<TResponse> {
  const { method = "GET", headers = {}, body, skipAuth = false, retryOn401 = true } = options;

  // Authorization 헤더에 토큰 추가 (skipAuth가 false일 때만)
  const authHeaders: Record<string, string> = { ...headers };
  if (!skipAuth) {
    const token = getValidToken();
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }
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

  const requestUrl =
    url.startsWith("http") || (API_BASE && url.startsWith(String(API_BASE)))
      ? url
      : `${API_BASE}${url}`;

  const startedAtMs = Date.now();
  let response: Response;
  try {
    response = await fetch(requestUrl, init);
  } catch (networkError) {
    console.error('[HTTP] Network error', {
      method,
      url: requestUrl,
      skipAuth,
      retryOn401,
      error: networkError,
    });
    throw networkError;
  }

  // 기본 응답 로그
  console.log('[HTTP] Response', {
    method,
    url: requestUrl,
    status: response.status,
    skipAuth,
    retryOn401,
    elapsedMs: Date.now() - startedAtMs,
  });

  // 401 처리: 토큰 만료 시 refresh 후 1회 재시도
  if (response.status === 401 && !skipAuth && retryOn401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retriedInit: RequestInit = {
        ...init,
        headers: {
          ...(init.headers as Record<string, string>),
          Authorization: `Bearer ${newToken}`,
        },
      };
      response = await fetch(requestUrl, retriedInit);
    } else {
      // 리프레시 실패 시 토큰 제거
      removeToken();
    }
  }

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

    const code =
      (typeof errorPayload === "object" && errorPayload !== null && "code" in errorPayload
        ? (errorPayload as any).code
        : undefined) || response.statusText || "Request failed";

    throw new Error(String(code));
  }

  if (contentType.includes("application/json")) {
    return (await response.json()) as TResponse;
  }

  return (await response.text()) as TResponse;
}

