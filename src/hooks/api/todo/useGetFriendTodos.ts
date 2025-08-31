import { useInfiniteQuery } from '@tanstack/react-query';
import { getFriendTodos, type GetFriendTodosResponse } from '../../../routers/todo/api/GetFriendTodosApi';

export interface UseGetFriendTodosOptions {
  pageSize?: number;
}

export const useGetFriendTodos = ({ pageSize = 10 }: UseGetFriendTodosOptions = {}) => {
  return useInfiniteQuery<GetFriendTodosResponse>({
    queryKey: ['friendTodos', pageSize],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getFriendTodos({ page: pageParam as number, size: pageSize }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.result.totalPageCount;
      const next = allPages.length;
      return next < totalPages ? next : undefined;
    },
  });
};
