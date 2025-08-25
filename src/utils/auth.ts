// 토큰 관리 유틸리티 함수들

export const TOKEN_KEY = 'accessToken';
export const TOKEN_EXPIRES_KEY = 'tokenExpiresAt';

// 토큰 저장
export const saveToken = (token: string, expiresIn?: number) => {
  localStorage.setItem(TOKEN_KEY, token);
  
  if (expiresIn) {
    const expiresAt = new Date().getTime() + (expiresIn * 1000);
    localStorage.setItem(TOKEN_EXPIRES_KEY, expiresAt.toString());
  }
};

// 토큰 가져오기
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// 토큰 만료 확인
export const isTokenExpired = (): boolean => {
  const expiresAt = localStorage.getItem(TOKEN_EXPIRES_KEY);
  if (!expiresAt) return true;
  
  return new Date().getTime() > parseInt(expiresAt);
};

// 유효한 토큰 가져오기
export const getValidToken = (): string | null => {
  const token = getToken();
  if (!token || isTokenExpired()) {
    removeToken();
    return null;
  }
  return token;
};

// 토큰 제거
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRES_KEY);
};

// 로그인 상태 확인
export const isLoggedIn = (): boolean => {
  return getValidToken() !== null;
};

interface JwtPayload {
  sub: string;
}

export const getUserId = (): number | undefined => {
  try {
    const token = getToken();
    if (!token) return undefined;

    const base64Payload = token.split('.')[1];
    const jsonPayload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    const payload: JwtPayload = JSON.parse(jsonPayload);

    return Number(payload.sub);
  } catch (e) {
    console.error("Invalid token", e);
    return undefined;
  }
};