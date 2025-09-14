import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { getStories, StoryApiResponse } from "../../../routers/todo/api/GetStoriesApi";

export const useGetStories = () => {
  return useInfiniteQuery<
    StoryApiResponse,
    Error,
    InfiniteData<StoryApiResponse>,
    string[],
    number
  >({
    queryKey: ["stories"],
    queryFn: ({ pageParam = 0 }) => getStories(pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const totalFriendsFetched = allPages.reduce((acc, page) => acc + page.result.friends.length, 0);
      if (totalFriendsFetched < lastPage.result.totalElementCount) {
        return allPages.length;
      }
      return undefined;
    },
    initialPageParam: 0,
    select: (data: InfiniteData<StoryApiResponse>) => {
      return data;
    },
  });
};
