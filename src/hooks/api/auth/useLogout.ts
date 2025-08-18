import { useMutation } from "@tanstack/react-query";
import { removeToken } from "@utils/auth";
import { logoutApi } from "@routers/user/api/LogoutApi";

export function useLogout() {
  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: logoutApi,
    onSuccess: () => {
      // 로컬에서 토큰 제거
      removeToken();
    }
  });
}
