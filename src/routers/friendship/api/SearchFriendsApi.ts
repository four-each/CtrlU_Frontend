import { http } from "@utils/http";

export interface SearchFriendsResponse {
    status: number;
    code: string;
    message: string;
    result: {
        values: Array<{
            id: number;
            nickname: string;
            email: string;
            image: string | null;
        }>;
        hasNext: boolean;
        nextCursorId: number;
    };
}

export async function searchFriendsApi(keyword: string, cursorId?: number): Promise<SearchFriendsResponse> {
    const params = new URLSearchParams();
    if (keyword) {
        params.append('keyword', keyword);
    }
    if (cursorId) {
        params.append('cursorId', cursorId.toString());
    }
    
    const queryString = params.toString();
    const url = queryString ? `/users/search?${queryString}` : '/users/search';
    
    return http<SearchFriendsResponse>(url, {
        method: "GET",
        skipAuth: false
    });
}
