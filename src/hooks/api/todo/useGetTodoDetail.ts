import { useQuery } from '@tanstack/react-query';
import { getTodoDetail, type GetTodoDetailResponse } from '../../../routers/todo/api/GetTodoDetailApi';

export const useGetTodoDetail = (id: string) => {
  return useQuery<GetTodoDetailResponse>({
    queryKey: ['todoDetail', id],
    queryFn: () => getTodoDetail(id),
    enabled: !!id,
  });
};
