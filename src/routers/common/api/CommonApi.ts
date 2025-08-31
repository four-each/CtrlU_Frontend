import { http } from "@utils/http";
import type { BaseResponse, PresignRequest, PresignResponse } from "@routers/auth/api/SignupApi";

export async function getAuthenticatedPresignedUrl(payload: PresignRequest): Promise<PresignResponse> {
  return http<PresignResponse, PresignRequest>(`/auth/presigned-url`, {
    method: "POST",
    body: payload,
    // skipAuth: true is removed to ensure authentication token is sent
  });
}
