import { http } from "@utils/http";

export interface BaseResponse {
    code: string;
    message: string;
    status: number;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export async function changePasswordApi(payload: ChangePasswordRequest): Promise<BaseResponse> {
    return http<BaseResponse>(`/users/password`, {
        method: "PATCH",
        body: payload,
        skipAuth: false,
    });
}