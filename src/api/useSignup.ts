import { useMutation } from "@tanstack/react-query";
import { signupApi, SignupRequest, SignupResponse, getPresignedUrl, PresignResponse, PresignRequest } from "@routers/auth/api";

export function useSignup() {
  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationKey: ["auth", "signup"],
    mutationFn: (payload) => signupApi(payload),
  });
}

export function usePresignUpload() {
  return useMutation<PresignResponse, Error, PresignRequest>({
    mutationKey: ["uploads", "presign"],
    mutationFn: (payload) => getPresignedUrl(payload),
  });
}

