import { useMutation } from "@tanstack/react-query";
import { removeToken } from "@utils/auth";

export function useLogout() {
  return useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: async () => {
      // 백엔드에 로그아웃 요청 (선택사항)
      try {
        // await fetch('/auth/logout', {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${getToken()}`
        //   }
        // });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
      
      // 로컬에서 토큰 제거
      removeToken();
      
      // 페이지 새로고침 또는 리다이렉트
      window.location.href = '/auth/login';
    },
  });
}
