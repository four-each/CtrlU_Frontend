import { useMutation } from '@tanstack/react-query';
import { createTodo, type CreateTodoRequest } from '../../../routers/todo/api/CreateTodoApi';

export const useCreateTodo = () => {
  return useMutation({
    mutationFn: (payload: CreateTodoRequest) => createTodo(payload),
    onError: (error) => {
      console.error('[useCreateTodo] 에러 발생', { error });
    },
  });
};

