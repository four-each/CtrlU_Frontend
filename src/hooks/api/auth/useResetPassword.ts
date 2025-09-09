import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi, ResetPasswordRequest } from "@routers/auth/api/ResetPasswordApi";
import { removeToken } from "@utils/auth";

export function useResetPassword() {
    return useMutation({
        mutationKey: ["auth", "reset-password"],
        mutationFn: (payload: ResetPasswordRequest) => resetPasswordApi(payload),
        onSuccess: () => {
            // 로컬에서 토큰 제거
            removeToken();
        }
    });
}