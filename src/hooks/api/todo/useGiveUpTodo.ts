import { useMutation } from '@tanstack/react-query';
import { giveUpTodo } from '../../../routers/todo/api/GiveUpTodoApi';

export const useGiveUpTodo = () => {
  return useMutation({
    mutationFn: (id: string) => giveUpTodo(id),
    onError: (error) => {
      console.error('[useGiveUpTodo] 에러 발생', { error });
    },
  });
};
