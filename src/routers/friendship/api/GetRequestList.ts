import { http } from "@utils/http";

export interface SentRequestListResponse { 
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

export async function getSentRequestListApi(): Promise<SentRequestListResponse> {
    return http<SentRequestListResponse>(`/friendships/sent`, {
        method: "GET",
        skipAuth: false
    });
}

export interface ReceivedRequestListResponse { 
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

export async function getReceivedRequestListApi(): Promise<ReceivedRequestListResponse> {
    return http<ReceivedRequestListResponse>(`/friendships/received`, {
        method: "GET",
        skipAuth: false
    });
}