export interface User {
  id: string;
  username: string;
  nickname: string;
  profileImage?: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetTime: number; // 목표 시간 (분)
  startTime: Date;
  endTime?: Date;
  startImage: string;
  endImage?: string;
  isCompleted: boolean;
  isAbandoned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted';
  createdAt: Date;
}

export interface TaskWithUser extends Task {
  user: User;
  isViewed: boolean; // 친구가 본 여부
}

export interface Story {
  id: string;
  task: Task;
  timestamp: Date;
  isViewed?: boolean;
}

export interface UserWithStories {
  user: User;
  stories: Story[];
  isMyStories: boolean;
  status?: StoryStatus;
}

export interface StoryItem {
  id: string;
  task: TaskWithUser;
  isMyTask: boolean;
  timestamp: Date;
} 

export type StoryStatus = "NONE" | "GREEN" | "GRAY"; 

export interface StoryUserStatus {
  id: number;
  profileImage: string;
  status: StoryStatus;
}

export interface StoryApiResponseResult {
  me: StoryUserStatus;
  friends: StoryUserStatus[];
  totalPageCount: number;
  totalElementCount: number;
}

export interface StoryApiResponse {
  status: number;
  code: string;
  message: string;
  result: StoryApiResponseResult;
}