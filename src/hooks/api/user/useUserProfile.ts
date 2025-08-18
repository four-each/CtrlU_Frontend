import { useQuery } from "@tanstack/react-query";
import { getUserProfileApi, UserProfileResponse } from "@routers/user/api/GetProfileApi";

export function useUserProfile() {
  return useQuery<UserProfileResponse, Error>({
    queryKey: ["user", "profile"],
    queryFn: getUserProfileApi,
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    retry: 1,
  });
}