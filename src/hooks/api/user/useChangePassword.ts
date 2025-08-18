import { changePasswordApi } from "@routers/user/api/ChangePasswordApi";
import { useMutation } from "@tanstack/react-query";

export function useChangePassword() {   
    return useMutation({
      mutationKey: ["auth", "changePassword"],
      mutationFn: changePasswordApi,
    });
  }