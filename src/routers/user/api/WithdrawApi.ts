import { http } from "@utils/http";

export interface BaseResponse {
    code: string;
    message: string;
    status: number;
}

export async function withdrawApi(): Promise<BaseResponse> {
    return http<BaseResponse>(`/auth/withdraw`, {
        method: "DELETE",
        skipAuth: false,
    });
}