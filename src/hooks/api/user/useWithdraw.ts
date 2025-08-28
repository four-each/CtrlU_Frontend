import { useMutation } from "@tanstack/react-query";
import { removeToken } from "@utils/auth";
import { withdrawApi } from "@routers/user/api/WithdrawApi";

export function useWithdraw() {
  return useMutation({
    mutationKey: ["auth", "withdraw"],
    mutationFn: withdrawApi,
    onSuccess: () => {
      // 로컬에서 토큰 제거
      removeToken();
    }
  });
}