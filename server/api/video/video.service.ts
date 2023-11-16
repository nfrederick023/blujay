import { FileFormatNotAllowed, UpdateVideoFailedException, VideoNotFoundException, VideoValidationFailed } from "./video.exceptions";
import { FileTypeResult, fileTypeFromBuffer, fileTypeFromFile } from "file-type";
import { UpdateVideo } from "./video.dto";
import { Video } from "@client/utils/types";
import { deleteVideo, getLibraryPath, getVideo, getVideoList, setVideoList } from "@server/utils/config";
import { fileMimeTypes } from "@client/utils/constants";

export const validateFiles = async (files: Express.Multer.File[]): Promise<void> => {
  for (const file of files) {
    let meta: FileTypeResult | undefined;
    try {
      meta = await fileTypeFromFile(file.path);
    } catch {
      deleteVideo(file.path);
      throw new VideoValidationFailed();
    }

    if (!meta || !fileMimeTypes.includes(meta.mime)) {
      deleteVideo(file.path);
      throw new FileFormatNotAllowed();
    }
  }
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
