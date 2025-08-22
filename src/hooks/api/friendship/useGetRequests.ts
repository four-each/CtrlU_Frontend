import { useQuery } from "@tanstack/react-query";
import { getReceivedRequestListApi, ReceivedRequestListResponse, getSentRequestListApi, SentRequestListResponse } from "@routers/friendship/api/GetRequestList";


export function useGetReceivedRequests() {
    return useQuery<ReceivedRequestListResponse, Error>({
      queryKey: ["friendship", "received-requests"],
      queryFn: getReceivedRequestListApi,
      staleTime: 5 * 60 * 1000, // 5분간 캐시
      retry: 1,
    });
}

export function useGetSentRequests() {
    return useQuery<SentRequestListResponse, Error>({
        queryKey: ["friendship", "sent-requests"],
        queryFn: getSentRequestListApi,
        staleTime: 5 * 60 * 1000, // 5분간 캐시
        retry: 1,
    });
}