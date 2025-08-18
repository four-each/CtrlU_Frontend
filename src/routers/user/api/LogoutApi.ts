import { http } from "@utils/http";

export interface BaseResponse {
    code: string;
    message: string;
    status: number;
}

export async function logoutApi(): Promise<BaseResponse> {
    return http<BaseResponse>(`/auth/logout`, {
        method: "POST",
        skipAuth: false,
    });
}