import { http } from "@utils/http";

export interface BaseResponse {
    code: string;
    message: string;
    status: number;
}

export interface ChangeProfileRequest {
    nickname: string;
    profileImageKey: string;
}

export async function changeProfileApi(payload: ChangeProfileRequest): Promise<BaseResponse> {
    return http<BaseResponse>(`/users/profile`, {
        method: "PATCH",
        body: payload,
        skipAuth: false,
    });
}