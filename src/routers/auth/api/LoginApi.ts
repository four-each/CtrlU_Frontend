import { http } from "@utils/http";

export interface BaseResponse {
    code: string;
    message: string;
    status: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse extends BaseResponse {
    result: {
      accessToken: string;
    }
}

export async function loginApi(payload: LoginRequest): Promise<LoginResponse> {
    return http<LoginResponse, LoginRequest>(`/auth/signin`, {
        method: "POST",
        body: payload,
        skipAuth: true,
    });
}