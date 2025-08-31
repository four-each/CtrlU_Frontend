import { http } from "../../../utils/http";

export interface GiveUpTodoResponse {
  status: number;
  code: string;
  message: string;
  result?: any;
}

export const giveUpTodo = async (id: string): Promise<GiveUpTodoResponse> => {
  try {
    const data = await http<GiveUpTodoResponse>(`/todos/${id}/giveUp`, { 
      method: 'POST' 
    });
    return data;
  } catch (error) {
    console.error('[GiveUpTodoApi] 요청 실패', { id, error });
    throw error;
  }
};
