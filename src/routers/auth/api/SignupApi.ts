import { http } from "@utils/http";

export interface BaseResponse {
  code: string;
  message: string;
  status: number;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  profileImageKey: string;
}

export async function signupApi(payload: SignupRequest): Promise<BaseResponse> {
  return http<BaseResponse, SignupRequest>(`/auth/signup`, {
    method: "POST",
    body: payload,
  });
}

export interface PresignRequest {
  imageType: string;
  fileExtension: string; // e.g., 'jpg', 'png'
  contentType: string;
}

export interface PresignResponse extends BaseResponse {
  result: {
    presignedUrl: string;
    imageKey: string; // e.g., 'profiles/abc-123.jpg'
  }
}

export async function getPresignedUrl(payload: PresignRequest): Promise<PresignResponse> {
  return http<PresignResponse, PresignRequest>(`/auth/presigned-url`, {
    method: "POST",
    body: payload,
  });
}

