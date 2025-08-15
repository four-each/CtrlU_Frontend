import { LoginRequest, LoginResponse, loginApi } from "@routers/auth/api/LoginApi";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
    return useMutation<LoginResponse, Error, LoginRequest>({
      mutationKey: ["auth", "login"],
      mutationFn: (payload) => loginApi(payload),
    });
}