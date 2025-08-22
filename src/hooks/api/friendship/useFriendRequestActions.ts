import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    acceptFriendRequestApi, 
    rejectFriendRequestApi, 
    cancelSentRequestApi,
    FriendRequestActionResponse 
} from "@routers/friendship/api/FriendRequestActionsApi";

export function useAcceptFriendRequest() {
    const queryClient = useQueryClient();
    
    return useMutation<FriendRequestActionResponse, Error, number>({
        mutationFn: acceptFriendRequestApi,
        onSuccess: () => {
            // 친구 요청 목록과 친구 목록을 새로고침
            queryClient.invalidateQueries({ queryKey: ["friendship", "received-requests"] });
            queryClient.invalidateQueries({ queryKey: ["friendship", "friends-list"] });
        },
    });
}

export function useRejectFriendRequest() {
    const queryClient = useQueryClient();
    
    return useMutation<FriendRequestActionResponse, Error, number>({
        mutationFn: rejectFriendRequestApi,
        onSuccess: () => {
            // 친구 요청 목록을 새로고침
            queryClient.invalidateQueries({ queryKey: ["friendship", "received-requests"] });
        },
    });
}

export function useCancelSentRequest() {
    const queryClient = useQueryClient();
    
    return useMutation<FriendRequestActionResponse, Error, number>({
        mutationFn: cancelSentRequestApi,
        onSuccess: () => {
            // 보낸 친구 요청 목록을 새로고침
            queryClient.invalidateQueries({ queryKey: ["friendship", "sent-requests"] });
        },
    });
}
