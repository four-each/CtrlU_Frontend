import { useMutation } from "@tanstack/react-query";
import { findPasswordApi, FindPasswordRequest } from "@routers/auth/api/FindPasswordApi";

export function useFindPassword() {
    return useMutation({
        mutationKey: ["auth", "find-password"],
        mutationFn: (payload: FindPasswordRequest) => findPasswordApi(payload),
    });
}