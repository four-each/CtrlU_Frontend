import { http } from "@utils/http";

export interface FriendListResponse { 
    status: number;
    code: string;
    message: string;
    result: {
        friends: Array<{
            id: number;
            nickname: string;
            email: string;
            image: string;
        }>
    };
}

export async function getFriendListApi(): Promise<FriendListResponse> {
    return http<FriendListResponse>(`/friendships`, {
        method: "GET",
        skipAuth: false
    });
}