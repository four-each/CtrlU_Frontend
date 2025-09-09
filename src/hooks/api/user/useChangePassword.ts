import { changePasswordApi } from "@routers/user/api/ChangePasswordApi";
import { useMutation } from "@tanstack/react-query";
import { removeToken } from "@utils/auth";

export function useChangePassword() {   
    return useMutation({
      mutationKey: ["auth", "changePassword"],
      mutationFn: changePasswordApi,
      onSuccess: () => {
        // 로컬에서 토큰 제거
        removeToken();
      }
    });
  }