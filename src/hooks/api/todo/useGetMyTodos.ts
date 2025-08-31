import { useQuery } from "@tanstack/react-query";
import { getMyTodos, type GetMyTodosResponse } from "../../../routers/todo/api/GetMyTodosApi";

export const useGetMyTodos = (status: string, target: string) => {
  return useQuery<GetMyTodosResponse>({
    queryKey: ['myTodos', status, target],
    queryFn: () => getMyTodos(status, target),
    enabled: !!status && !!target,
  });
};
