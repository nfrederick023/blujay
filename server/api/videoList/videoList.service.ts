import { OrderType, QueryField, SortType, Video } from "@client/utils/types";
import { getVideoList as getVideoListFile } from "@server/utils/config";
import { sortVideos } from "@client/utils/sortVideo";

export const getVideoList = async (page: number, size: number, sort: SortType, order: OrderType, query: string, queryField: QueryField[]): Promise<Video[]> => {
  const videoList = getVideoListFile();
  const sortedVideoList = sortVideos(videoList, sort, order);
  return sortedVideoList.slice(page * size, page * size + size);
};

