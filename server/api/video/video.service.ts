import { OrderType, QueryField, SortType, Video } from "@client/utils/types";
import { UpdateVideo } from "./video.dto";
import { UpdateVideoFailedException, VideoNotFoundException } from "./video.exceptions";
import { getVideoList, moveVideoToLibrary, setVideoList } from "@server/utils/config";
import { listVideos } from "@server/utils/listVideos";
import { sortVideos } from "@client/utils/sortVideo";
import { validateVideo } from "@server/utils/validateVideo";


export const validateFiles = async (filePath: string): Promise<void> => {
  await validateVideo(filePath);
  moveVideoToLibrary(filePath);
  await listVideos();
};

export const updateVideo = async (updateVideo: UpdateVideo): Promise<void> => {
  const videoList = getVideoList();
  const videoIndexToUpdate = videoList.findIndex(video => video.id === updateVideo.id);

  if (videoIndexToUpdate === -1) {
    throw new VideoNotFoundException();
  }

  const newVideo: Video = { ...videoList[videoIndexToUpdate], ...updateVideo };
  videoList[videoIndexToUpdate] = newVideo;

  try {
    setVideoList(videoList);
  } catch (e) {
    throw new UpdateVideoFailedException();
  }
};

export const getVideos = async (page: number, size: number, sort: SortType, order: OrderType, query: string, queryField: QueryField[]): Promise<Video[]> => {
  const videoList = getVideoList();
  const sortedVideoList = sortVideos(videoList, sort, order);
  return sortedVideoList.slice(page * size, page * size + size);
};
