import { http } from "../../../utils/http";

export interface FriendTodo {
  id: number;
  todoName: string;
  userName: string;
  durationTime: number; // milliseconds
}

export interface GetFriendTodosResult {
  todos: FriendTodo[];
  totalPageCount: number;
  totalElementCount: number;
}

export interface GetFriendTodosResponse {
  status: number;
  code: string;
  message: string;
  result: GetFriendTodosResult;
}

export interface GetFriendTodosParams {
  page: number;
  size: number;
}

export const getFriendTodos = async ({ page, size }: GetFriendTodosParams): Promise<GetFriendTodosResponse> => {
  const query = new URLSearchParams({
    status: 'IN_PROGRESS',
    target: 'friend',
    size: String(size),
    page: String(page),
  }).toString();

  const url = `/todos?${query}`;

  try {
    const data = await http<GetFriendTodosResponse>(url, { method: 'GET' });
    return data;
  } catch (error) {
    console.error('[GetFriendTodosApi] 요청 실패', { page, size, error });
    throw error;
  }
};


