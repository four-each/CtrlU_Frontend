import { http } from "@utils/http";

export interface BaseResponse {
    code: string;
    message: string;
    status: number;
}

export interface WithdrawRequest {
    password: string;
}

export async function withdrawApi(payload: WithdrawRequest): Promise<BaseResponse> {
    return http<BaseResponse>(`/auth/withdraw`, {
        method: "DELETE",
        body: payload,
        skipAuth: false,
    });
}