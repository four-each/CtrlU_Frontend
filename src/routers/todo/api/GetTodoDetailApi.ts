import { http } from "../../../utils/http";

export interface TodoDetail {
  title: string;
  startImage: string;
  endImage: string | null;
  profileImage: string;
  challengeTime: string; // 목표 시간 (HH:MM:SS 형식)
  durationTime: number; // 진행 중인 시간 (밀리초)
  isMine: boolean;
}

export interface GetTodoDetailResult {
  title: string;
  startImage: string;
  endImage: string | null;
  profileImage: string;
  challengeTime: string;
  durationTime: number;
  isMine: boolean;
}

export interface GetTodoDetailResponse {
  status: number;
  code: string;
  message: string;
  result: GetTodoDetailResult;
}

export const getTodoDetail = async (id: string): Promise<GetTodoDetailResponse> => {
  try {
    const data = await http<GetTodoDetailResponse>(`/todos/${id}`, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('[GetTodoDetailApi] 요청 실패', { id, error });
    throw error;
  }
};
