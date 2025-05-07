import { Video } from "@client/utils/types";
import { deleteThumbnail, getThumbnailList, getThumbnailsPath, getVideoList, markVideoUnsupported } from "./config";
import { fileTypeFromFile } from "file-type";
import { sizeReductionPercent } from "@client/utils/constants";
import ffmpeg from "fluent-ffmpeg";

export const reindexThumbnails = async (): Promise<void> => {
  let thumbnails = getThumbnailList();
  const videos = getVideoList();

  for (const video of videos) {
    thumbnails = thumbnails.filter(thumbnail => !(thumbnail === video.thumbnailFilename));

    if (!await doesThumbnailExist(video)) {
      await createThumbnail(video);
    }
  }

  thumbnails.forEach(thumbnail => deleteThumbnail(thumbnail));
};

const resetThumbnail = (video: Video): void => {

};

const createGifThumbnaild = (video: Video): Promise<void> => {
  const folder = getThumbnailsPath();
  return new Promise<void>((res, rej) => {
    ffmpeg(video.filepath)
      .on("error", (err) => {
        console.warn("Failed to generate thumbnail for " + video.filepath + ". Marking files as unsupported.");
        markVideoUnsupported(video.filepath);
        rej();
      })
      .on("end", () => {
        res();
      }).screenshots({
        count: 1,
        filename: video.thumbnailFilename,
        folder,
        size: `${sizeReductionPercent}%`,
        timemarks: ["0"]
      });
  });
};

const createVideoThumbnail = (video: Video): Promise<void> => {
  const folder = getThumbnailsPath();
  return new Promise<void>((res, rej) => {
    ffmpeg(video.filepath)
      .inputOptions("-t 10")
      .on("error", (err) => {
        console.warn("Failed to generate thumbnail for " + video.filepath + ". Marking files as unsupported.");
        markVideoUnsupported(video.filepath);
        rej();
      })
      .on("end", () => {
        res();
      }).screenshots({
        count: 1,
        filename: video.thumbnailFilename,
        folder,
        size: `${sizeReductionPercent}%`,
        timemarks: ["10%"]
      });
  });
};

const createImageThumbnail = (video: Video): Promise<void> => {
  const scale = sizeReductionPercent / 100.0;

  return new Promise<void>((res, rej) => {
    ffmpeg(video.filepath).output(video.thumbnailFilepath)
      .outputOptions(["-preset", "default", "-vf", `scale=iw*${scale}:ih*${scale}`]).on("error", () => {
        console.warn("Failed to generate thumbnail for " + video.filepath + ". Marking files as unsupported.");
        markVideoUnsupported(video.filepath);
        rej();
      })
      .on("end", () => {
        res();
      }).run();
  });
};

const doesThumbnailExist = async (video: Video): Promise<boolean> => {
  const folder = getThumbnailsPath();
  const thumbnails = getThumbnailList();
  return (thumbnails.includes(video.thumbnailFilename) && !!await fileTypeFromFile(folder + video.thumbnailFilename));
};

const createThumbnail = (video: Video): Promise<void> | undefined => {
  if (video.type === "video") {
    return createVideoThumbnail(video);
  }

  if (video.type === "gif") {
    return createGifThumbnaild(video);
  }

  if (video.type === "image") {
    return createImageThumbnail(video);
  }
};