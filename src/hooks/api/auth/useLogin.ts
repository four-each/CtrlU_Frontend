import { LoginRequest, LoginResponse, loginApi } from "@routers/auth/api/LoginApi";
import { useMutation } from "@tanstack/react-query";
import { saveToken, removeToken } from "@utils/auth";

export function useLogin() {
    return useMutation<LoginResponse, Error, LoginRequest>({
      mutationKey: ["auth", "login"],
      mutationFn: (payload) => loginApi(payload),
      onSuccess: (data) => {
        // 로그인 성공 시 access token을 저장
        if (data.result?.accessToken) {
          // 백엔드에서 expiresIn을 제공하지 않으므로 기본값 600초(10분) 사용
          saveToken(data.result.accessToken, 600);
        }
      },
      onError: (error) => {
        // 로그인 실패 시 기존 토큰 제거
        removeToken();
      }
    });
}