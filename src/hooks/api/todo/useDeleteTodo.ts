import { useMutation } from '@tanstack/react-query';
import { deleteTodo } from '../../../routers/todo/api/DeleteTodoApi';

export const useDeleteTodo = () => {
  return useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onError: (error) => {
      console.error('[useDeleteTodo] 에러 발생', { error });
    },
  });
};
