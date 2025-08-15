import { http } from "@utils/http";

export interface UserProfileResponse {
    status: number;
    code: string;
    message: string;
    result: {
        nickname: string;
        profileImage: string;
    };
}

export async function getUserProfileApi(): Promise<UserProfileResponse> {
    return http<UserProfileResponse>(`/users/profile`, {
        method: "GET",
        skipAuth: true,
    });
}