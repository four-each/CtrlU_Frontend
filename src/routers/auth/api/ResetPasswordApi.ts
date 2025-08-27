import { http } from "@utils/http";

export interface BaseResponse {
  code: string;
  message: string;
  status: number;
}

export interface ResetPasswordRequest {
  verifyToken: string;
  newPassword: string;
}

export async function resetPasswordApi(payload: ResetPasswordRequest): Promise<BaseResponse> {
  return http<BaseResponse, ResetPasswordRequest>(`/auth/reset-password`, {
    method: "POST",
    body: payload,
    skipAuth: true,
  });
}