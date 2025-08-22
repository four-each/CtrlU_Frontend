import { useQuery } from "@tanstack/react-query";
import { getFriendListApi, FriendListResponse } from "@routers/friendship/api/GetFriendListApi";


export function useGetFriends() {
    return useQuery<FriendListResponse, Error>({
      queryKey: ["friendship", "friends-list"],
      queryFn: getFriendListApi,
      staleTime: 5 * 60 * 1000, // 5분간 캐시
      retry: 1,
    });
  }