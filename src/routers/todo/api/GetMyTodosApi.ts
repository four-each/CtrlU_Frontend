import { http } from "../../../utils/http";

export interface Todo {
  id: number;
  todoName: string;
  userName: string;
  durationTime: number;
}

export interface GetMyTodosResult {
  todos: Todo[];
  totalPageCount: number;
  totalElementCount: number;
}

export interface GetMyTodosResponse {
    status: number;
    code: string;
    message: string;
    result: GetMyTodosResult;
}

export const getMyTodos = async (status: string, target: string) => {
  try {
    const query = new URLSearchParams({ status, target }).toString();
    const url = `/todos?${query}`;
    const data = await http<GetMyTodosResponse>(url, { method: "GET" });
    return data;
  } catch (error) {
    // 상세 디버깅 로그
    console.error("[GetMyTodosApi] 요청 실패", {
      status,
      target,
      error,
    });
    throw error;
  }
};
