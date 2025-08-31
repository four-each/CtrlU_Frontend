import { useMutation } from '@tanstack/react-query';
import { getAuthenticatedPresignedUrl } from '@routers/common/api/CommonApi';
import type { PresignRequest, PresignResponse } from '@routers/auth/api/SignupApi';

export const useAuthenticatedPresignUpload = () => {
  return useMutation<PresignResponse, Error, PresignRequest>({ 
    mutationFn: (payload) => getAuthenticatedPresignedUrl(payload),
  });
};
