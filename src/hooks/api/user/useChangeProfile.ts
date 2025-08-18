import { changeProfileApi } from "@routers/user/api/ChangeProfileApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useChangeProfile() {   
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["auth", "changeProfile"],
        mutationFn: changeProfileApi,
        onSuccess: () => {
            // 변경 직후 프로필 데이터를 최신화
            queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
        },
    });
}