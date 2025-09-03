import { http } from "../../../utils/http";

export interface DeleteTodoResponse {
  status: number;
  code: string;
  message: string;
  result?: any;
}

export const deleteTodo = async (id: string): Promise<DeleteTodoResponse> => {
  try {
    const data = await http<DeleteTodoResponse>(`/todos/${id}`, { 
      method: 'DELETE' 
    });
    return data;
  } catch (error) {
    console.error('[DeleteTodoApi] 요청 실패', { id, error });
    throw error;
  }
};
