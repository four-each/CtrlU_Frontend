import { http } from '../../../utils/http';

export interface CompleteTodoRequest {
  id: string;
  durationTime: number;
  endImageKey: string;
}

export interface CompleteTodoResponse {
  // Define response structure if needed
  status: number;
  message: string;
}

export const completeTodo = async (payload: CompleteTodoRequest): Promise<CompleteTodoResponse> => {
  const { id, ...body } = payload;
  try {
    const response = await http<CompleteTodoResponse>(`/todos/${id}/complete`, { method: 'POST', body });
    console.log('[CompleteTodoApi] 요청 성공', response);
    return response;
  } catch (error) {
    console.error('[CompleteTodoApi] 요청 실패', { payload, error });
    throw error;
  }
};
