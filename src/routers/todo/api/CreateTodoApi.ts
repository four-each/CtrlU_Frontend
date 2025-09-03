import { http } from "../../../utils/http";

export interface CreateTodoRequest {
  title: string;
  challengeTime: string; // LocalTime 형식 (HH:MM:SS)
  startImageKey: string;
}

export interface CreateTodoResponse {
  status: number;
  code: string;
  message: string;
  result?: any;
}

export const createTodo = async (payload: CreateTodoRequest): Promise<CreateTodoResponse> => {
  try {
    // startImageKey가 빈 문자열일 경우, 요청 본문에서 제외
    const body: Partial<CreateTodoRequest> = { ...payload };
    if (!body.startImageKey) {
      delete body.startImageKey;
    }

    const data = await http<CreateTodoResponse>(`/todos`, { 
      method: 'POST',
      body: body
    });
    return data;
  } catch (error) {
    console.error('[CreateTodoApi] 요청 실패', { payload, error });
    throw error;
  }
};

