import { http } from "@utils/http";

export interface BaseResponse {
  code: string;
  message: string;
  status: number;
}

export interface FindPasswordResponse extends BaseResponse {
  result: {
    nickname: string
  }
}

export interface FindPasswordRequest {
  email: string;
}

export async function findPasswordApi(payload: FindPasswordRequest): Promise<FindPasswordResponse> {
  return http<FindPasswordResponse, FindPasswordRequest>(`/auth/find-password`, {
    method: "POST",
    body: payload,
    skipAuth: true,
  });
}
