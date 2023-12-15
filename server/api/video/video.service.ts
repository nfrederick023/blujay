import { UpdateVideo } from "./video.dto";
import { UpdateVideoFailedException, VideoNotFoundException } from "../videoList/videoList.exceptions";
import { Video } from "@client/utils/types";
import { getVideoList, moveVideoToLibrary, setVideoList } from "@server/utils/config";
import { listVideos } from "@server/utils/listVideos";
import { validateVideo } from "@server/utils/validateVideo";


export const validateFiles = async (filePath: string): Promise<void> => {
  await validateVideo(filePath);
  moveVideoToLibrary(filePath);
  await listVideos();
};

export const updateVideo = async (updateVideo: UpdateVideo): Promise<void> => {
  const VideoList = getVideoList();
  const videoToUpdate = VideoList.find(video => video.id === updateVideo.id);

  if (!videoToUpdate) {
    throw new VideoNotFoundException();
  }

  const updatedVideoList = VideoList.filter(video => video.id !== videoToUpdate.id);
  const newVideo: Video = { ...videoToUpdate, ...updateVideo };
  updatedVideoList.push(newVideo);

  try {
    setVideoList(updatedVideoList);
  } catch (e) {
    throw new UpdateVideoFailedException();
  }
};
