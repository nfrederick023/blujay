import { DeleteVideo, RenameFile, UpdateVideo } from "./video.dto";
import { OrderType, QueryField, SortType, Video } from "@client/utils/types";
import { UpdateVideoFailedException, VideoNotFoundException } from "./video.exceptions";
import { deleteVideo as fsDeleteVideo, renameVideoFile as fsRenameVideoFile } from "@server/utils/config";
import { getVideoList, moveVideoToLibrary, setVideoList } from "@server/utils/config";
import { reindexVideoList } from "@server/utils/video-service";
import { sortVideos } from "@client/utils/sortVideo";
import { validateVideo } from "@server/utils/validateVideo";
import path from "path";

export const getVideos = async (page: number, size: number, sort: SortType, order: OrderType, query: string, queryField: QueryField[]): Promise<Video[]> => {
  const videoList = getVideoList();
  const sortedVideoList = sortVideos(videoList, sort, order);
  return sortedVideoList.slice(page * size, page * size + size);
};

export const validateFiles = async (filePath: string): Promise<void> => {
  await validateVideo(filePath);
  moveVideoToLibrary(filePath);
  await reindexVideoList();
};

export const updateVideo = (updateVideo: UpdateVideo): void => {
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

export const deletevideo = (deleteVideo: DeleteVideo): void => {
  const videoList = getVideoList();
  const videoToDelete = videoList.find(video => video.id === deleteVideo.id);

  if (!videoToDelete) {
    throw new VideoNotFoundException();
  }

  fsDeleteVideo(videoToDelete.filepath);
};

export const renameFile = async (renameFile: RenameFile): Promise<Video> => {
  const videoList = getVideoList();
  const videoToRename = videoList.find(video => video.id === renameFile.id);

  if (!videoToRename) {
    throw new VideoNotFoundException();
  }

  const oldFilePath = videoToRename.filepath;
  const newFilePath = path.dirname(oldFilePath) + "\\" + renameFile.newName + "." + videoToRename.extentsion;
  fsRenameVideoFile(oldFilePath, newFilePath);

  const newVideo: Video = { ...videoToRename, filename: renameFile.newName, filepath: newFilePath };
  const filteredVideoList: Video[] = [...videoList.filter(video => video.id !== renameFile.id), newVideo];
  setVideoList(filteredVideoList);
  await reindexVideoList();
  return newVideo;
};