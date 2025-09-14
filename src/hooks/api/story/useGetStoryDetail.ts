import { useQuery } from '@tanstack/react-query';
import { http } from '../../../utils/http';

export interface StoryDetailResult {
  title: string;
  startImage: string;
  endImage: string | null;
  challengeTime: string;
  durationTime: number;
  userName: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  nextId: number | null;
  prevId: number | null;
  totalCount: number;
  profileImage: string;
}

export interface StoryDetailResponse {
  status: number;
  code: string;
  message: string;
  result: StoryDetailResult;
}

export const getStoryDetail = async (
  userId: number,
  targetId: number,
  nowId: number = 0
): Promise<StoryDetailResponse> => {
  const response = await http<StoryDetailResponse>(
    `/todos/detail/within-24hours?userId=${userId}&targetId=${targetId}&nowId=${nowId}`,
    {
      method: 'GET',
    }
  );
  return response;
};

export const useGetStoryDetail = (targetId: number, nowId: number = 0, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['storyDetail', targetId, nowId],
    queryFn: async () => {
      const userId = await import('../../../utils/auth').then(module => module.getUserId());
      if (!userId) throw new Error('User not authenticated');
      return getStoryDetail(userId, targetId, nowId);
    },
    enabled: enabled && !!targetId,
  });
};
