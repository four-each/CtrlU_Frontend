import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi, ResetPasswordRequest } from "@routers/auth/api/ResetPasswordApi";

export function useResetPassword() {
    return useMutation({
        mutationKey: ["auth", "reset-password"],
        mutationFn: (payload: ResetPasswordRequest) => resetPasswordApi(payload),
    });
}