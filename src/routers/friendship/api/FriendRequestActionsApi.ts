import { http } from "@utils/http";

export interface FriendRequestActionResponse {
    status: number;
    code: string;
    message: string;
}

export interface friendRequestRequest {
    targetId: number;
}

export async function friendRequestApi(payload: friendRequestRequest): Promise<FriendRequestActionResponse> {
    return http<FriendRequestActionResponse>(`/friendships}`, {
        method: "POST",
        body: payload,
        skipAuth: false
    });
}

export async function acceptFriendRequestApi(friendId: number): Promise<FriendRequestActionResponse> {
    return http<FriendRequestActionResponse>(`/friendships/${friendId}`, {
        method: "PATCH",
        skipAuth: false
    });
}

export async function rejectFriendRequestApi(friendId: number): Promise<FriendRequestActionResponse> {
    return http<FriendRequestActionResponse>(`/friendships/${friendId}/reject`, {
        method: "PATCH",
        skipAuth: false
    });
}

export async function cancelSentRequestApi(friendId: number): Promise<FriendRequestActionResponse> {
    return http<FriendRequestActionResponse>(`/friendships/${friendId}/cancel`, {
        method: "DELETE",
        skipAuth: false
    });
}

export async function deleteFriendApi(friendId: number): Promise<FriendRequestActionResponse> {
    return http<FriendRequestActionResponse>(`/friendships/${friendId}`, {
        method: "DELETE",
        skipAuth: false
    });
}
