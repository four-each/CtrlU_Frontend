import { changeProfileApi } from "@routers/user/api/ChangeProfileApi";
import { useMutation } from "@tanstack/react-query";

export function useChangeProfile() {   
    return useMutation({
        mutationKey: ["auth", "changeProfile"],
        mutationFn: changeProfileApi,
    });
}