import { http } from "@utils/http";

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  profileImageKey: string;
}

export interface SignupResponse {
  userId: string;
  email: string;
  nickname: string;
}

export async function signupApi(payload: SignupRequest): Promise<SignupResponse> {
  return http<SignupResponse, SignupRequest>(`/auth/signup`, {
    method: "POST",
    body: payload,
  });
}

export interface PresignRequest {
  imageType: string;
  fileExtension: string; // e.g., 'jpg', 'png'
}

export interface PresignResponse {
  presignedUrl: string;
  imageKey: string; // e.g., 'profiles/abc-123.jpg'
}

export async function getPresignedUrl(payload: PresignRequest): Promise<PresignResponse> {
  return http<PresignResponse, PresignRequest>(`/auth/presigned-url`, {
    method: "POST",
    body: payload,
  });
}

