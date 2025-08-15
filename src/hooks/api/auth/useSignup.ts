import { useMutation } from "@tanstack/react-query";
import { signupApi, SignupRequest, BaseResponse, getPresignedUrl, PresignResponse, PresignRequest } from "@routers/auth/api/SignupApi";

export function useSignup() {
  return useMutation<BaseResponse, Error, SignupRequest>({
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

