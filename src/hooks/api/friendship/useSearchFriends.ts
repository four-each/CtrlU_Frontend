import { useQuery } from "@tanstack/react-query";
import { searchFriendsApi, SearchFriendsResponse } from "@routers/friendship/api/SearchFriendsApi";

export function useSearchFriends(query: string, cursorId?: number) {
    return useQuery<SearchFriendsResponse, Error>({
        queryKey: ["friendship", "search", query, cursorId],
        queryFn: () => searchFriendsApi(query, cursorId),
        enabled: query.length > 0, // 검색어가 있을 때만 API 호출
        staleTime: 2 * 60 * 1000, // 2분간 캐시
        retry: 1,
    });
}
