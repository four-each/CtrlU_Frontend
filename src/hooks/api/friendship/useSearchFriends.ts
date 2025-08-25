import { useQuery } from "@tanstack/react-query";
import { searchFriendsApi, SearchFriendsResponse } from "@routers/friendship/api/SearchFriendsApi";

export function useSearchFriends(keyword: string, cursorId?: number) {
    return useQuery<SearchFriendsResponse, Error>({
        queryKey: ["friendship", "search", keyword, cursorId],
        queryFn: () => searchFriendsApi(keyword, cursorId),
        enabled: keyword.length > 0, // 검색어가 있을 때만 API 호출
        staleTime: 2 * 60 * 1000, // 2분간 캐시
        retry: 1,
    });
}
