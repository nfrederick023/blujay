import { OrderType, QueryField, SortType, Video } from "@client/utils/types";
import { UpdateVideo } from "./videoList.dto";
import { UpdateVideoFailedException, VideoNotFoundException } from "./videoList.exceptions";
import { getVideoList as getVideoListFile, setVideoList } from "@server/utils/config";
import { sortVideos } from "@client/utils/sortVideo";


export const getVideoList = async (page: number, size: number, sort: SortType, order: OrderType, query: string, queryField: QueryField[]): Promise<Video[]> => {
  const videoList = await getVideoListFile();
  const sortedVideoList = sortVideos(videoList, sort, order);
  return sortedVideoList.slice(page * size, page * size + size);
};

export const updateVideoList = async (updatedVideo: UpdateVideo): Promise<Video> => {
  const videoList = await getVideoListFile();
  const videoToUpdate = videoList.find(video => video.id === updatedVideo.id);

  if (!videoToUpdate) {
    throw VideoNotFoundException;
  }

  const updatedVideoList = videoList.filter(video => video.id !== videoToUpdate.id);
  const newVideo = { ...updatedVideo, ...videoToUpdate };
  updatedVideoList.push(newVideo);

  try {
    await setVideoList(updatedVideoList);
  } catch (e) {
    throw UpdateVideoFailedException;
  }

  return newVideo;
};
