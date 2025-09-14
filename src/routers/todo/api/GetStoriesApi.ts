import { http } from "../../../utils/http";

export type StoryStatusType = "NONE" | "GREEN" | "GRAY" | "RED";

export interface StoryUser {
  id: number;
  userName: string;
  profileImage: string;
  status: StoryStatusType;
}

export interface StoryApiResult {
  me: StoryUser;
  friends: StoryUser[];
  totalPageCount: number;
  totalElementCount: number;
}

export interface StoryApiResponse {
  status: number;
  code: string;
  message: string;
  result: StoryApiResult;
}

export const getStories = async (pageParam: number = 0, pageSize: number = 5): Promise<StoryApiResponse> => {
  const response = await http<StoryApiResponse>(`/todos/within-24hours?page=${pageParam}&size=${pageSize}`, {
    method: "GET",
  });
  return response;
};
