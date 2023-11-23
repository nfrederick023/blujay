import { UpdateVideo } from "./video.dto";
import { UpdateVideoFailedException, VideoNotFoundException } from "../videoList/videoList.exceptions";
import { ValidationException } from "./video.exceptions";
import { Video } from "@client/utils/types";
import { deleteVideo, getVideoList, moveVideoToLibrary, setVideoList } from "@server/utils/config";
import { listVideos } from "@server/utils/listVideos";
import { validateVideo } from "@server/utils/validateVideo";


export const validateFiles = async (filePath: string): Promise<void> => {
  try {
    await validateVideo(filePath);
  } catch (e: unknown) {
    deleteVideo(filePath);
    throw new ValidationException(e as string);
  }

  moveVideoToLibrary(filePath);
  // this will index and create thumbnails
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
