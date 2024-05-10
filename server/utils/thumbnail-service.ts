import { Video } from "@client/utils/types";
import { deleteThumbnail, getThumbnailList, getThumbnailsPath, getVideoList, markVideoUnsupported } from "./config";
import { fileTypeFromFile } from "file-type";
import { sizeReductionPercent } from "@client/utils/constants";
import ffmpeg from "fluent-ffmpeg";

export const reindexThumbnails = async (): Promise<void> => {
  let thumbnails = getThumbnailList();
  const videos = getVideoList();

  await Promise.all(videos.filter(async video => {

    thumbnails = thumbnails.filter(thumbnail => !(thumbnail === video.thumbnailFilename));

    if (!await doesThumbnailExist(video)) {
      return createThumbnail(video);
    }
  }));

  thumbnails.forEach(thumbnail => deleteThumbnail(thumbnail));
};

const resetThumbnail = (video: Video): void => {

};

const createVideoOrGifThumbnail = (video: Video): Promise<void> => {
  const timemarks = video.type === "gif" ? ["0"] : ["10%"];
  const folder = getThumbnailsPath();
  return new Promise<void>((res, rej) => {
    ffmpeg(video.filepath)
      .inputOptions("-t 10")
      .on("error", (e) => {
        console.warn("Failed to generate thumbnail for " + video.filepath + ". Marking files as unsupported.");
        markVideoUnsupported(video.filepath);
        rej();
      })
      .on("exit", () => {
        res();
      })
      .screenshots({
        count: 1,
        filename: video.thumbnailFilename,
        folder,
        size: `${sizeReductionPercent}%`,
        timemarks
      });
  });

};

const createImageThumbnail = (video: Video): Promise<void> => {
  return new Promise<void>((res, rej) => {
    ffmpeg(video.filepath).output(video.thumbnailFilepath)
      .outputOptions(["-preset", "default", "-vf", `scale=iw*0.${sizeReductionPercent}:ih*0.${sizeReductionPercent}`]).on("error", () => {
        console.warn("Failed to generate thumbnail for " + video.filepath + ". Marking files as unsupported.");
        markVideoUnsupported(video.filepath);
        rej();
      }).on("exit", () => {
        res();
      }).run();
  });
};

const doesThumbnailExist = async (video: Video): Promise<boolean> => {
  const folder = getThumbnailsPath();
  const thumbnails = getThumbnailList();
  return (thumbnails.includes(video.thumbnailFilename) && !!await fileTypeFromFile(folder + video.thumbnailFilename));
};

const createThumbnail = (video: Video): Promise<void> => {
  if ((video.type === "video" || video.type === "gif")) {
    return createVideoOrGifThumbnail(video);
  } else {
    return createImageThumbnail(video);
  }
};