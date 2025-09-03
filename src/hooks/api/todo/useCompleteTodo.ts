import { useMutation } from '@tanstack/react-query';
import { completeTodo, type CompleteTodoRequest } from '../../../routers/todo/api/CompleteTodoApi';

export const useCompleteTodo = () => {
  return useMutation({ 
    mutationFn: (payload: CompleteTodoRequest) => completeTodo(payload),
    onSuccess: (data) => {
      console.log('[useCompleteTodo] 성공', data);
    },
    onError: (error) => {
      console.error('[useCompleteTodo] 에러 발생', { error });
    },
  });
};
