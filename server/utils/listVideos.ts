import * as mime from "mime-types";
import { Extentsions, Video, VideoType } from "@client/utils/types";
import { createVideoListBackup, deleteThumbnail, getLibraryPath, getThumbnailsPath, getUserPassword, getVideoList, setVideoList } from "./config";
import { fileExtensions, imageExtensions } from "@client/utils/constants";
import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";
import fse from "fs-extra";
import glob from "glob-promise";
import path from "path";
import pathToFfmpeg from "ffmpeg-static";
import seedrandom from "seedrandom";

ffmpeg.setFfprobePath(ffprobeStatic.path);
ffmpeg.setFfmpegPath(pathToFfmpeg ?? "");

export const listVideos = async (): Promise<Video[]> => {
  createVideoListBackup();

  const libraryPath = getLibraryPath();
  // gets the file location of all videos which are supported
  const allFiles = await glob.promise(`${libraryPath}/**/*.*`);
  const videoFilePaths = await glob.promise(`${libraryPath}/**/*.@(${fileExtensions.join("|")})`);

  if (allFiles.length !== videoFilePaths.length) {
    console.warn("Unsupported file extentsions were found in the library and will not be indexed!");
  }

  cleanState(videoFilePaths);

  const videoDetails: Video[] = [];
  for (const filePath of videoFilePaths) {
    const videoState = getCreateVideo(filePath);
    if (videoState) {
      videoDetails.push(
        videoState
      );
    }
  }

  createThumbnails(videoDetails);
  return videoDetails;
};

const createThumbnails = async (videos: Video[]): Promise<void> => {
  const sizeReductionPercent = 50;
  const folder = getThumbnailsPath();
  const thumbnails = await fse.readdir(folder);
  let oldThumbnails = thumbnails;
  videos.forEach(video => {
    const filename = video.id + ".webp";
    oldThumbnails = oldThumbnails.filter(thumbnail => !(thumbnail === filename));
    if (!thumbnails.includes(filename)) {
      const timemarks = video.type === "video" ? ["20%"] : ["0"];

      if (video.type === "video" || video.type === "gif") {
        ffmpeg(video.filePath)
          .inputOptions("-t 10")
          .screenshots({
            count: 1,
            filename,
            folder,
            size: `${sizeReductionPercent}%`,
            timemarks
          });
      } else {
        ffmpeg(video.filePath).output(folder + filename)
          .outputOptions(["-preset", "default", "-vf", `scale=iw*0.${sizeReductionPercent}:ih*0.${sizeReductionPercent}`]).run();
      }
    }
  });

  oldThumbnails.forEach(thumbnail => deleteThumbnail(thumbnail));
};

// removes any videos in the videoList that are not found
const cleanState = (videoFilePaths: string[]): void => {
  const videoList = getVideoList();
  setVideoList(videoList.filter(video => videoFilePaths.includes(video.filePath)));
};

// gets a video from videoList, creates one if not found
const getCreateVideo = (filePath: string): Video | null => {
  const fileName = path.basename(filePath);
  const name = path.parse(fileName).name;
  const videoStats = fse.statSync(filePath);
  const mimeType = mime.lookup(fileName) as string;
  const views = 0;

  const videoList = getVideoList();
  let category = path.dirname(filePath).split("\\").pop() ?? "";
  const extentsion = fileName.split(".").pop() as Extentsions;
  const id = parseInt((seedrandom(fileName + getUserPassword())() * 9e7 + 1e7).toString()).toString();
  const thumbnailPath = path.join(getThumbnailsPath() + id + ".webp");
  let type: VideoType = "video";

  if (imageExtensions.includes(extentsion)) {
    type = "image";
  }

  if (extentsion === "gif") {
    type = "gif";
  }

  if (category === "library")
    category = "";

  // check if the video already is persisted within the state
  const videoState = videoList.find((video) => { return video.filePath === filePath; });

  if (videoState) {

    // reindex if any of the following values don't match for whatever reason
    if (videoState.mimeType !== mimeType || videoState.thumbnailPath !== thumbnailPath || videoState.extentsion !== extentsion || videoState.size !== videoStats.size || videoState.uploaded !== videoStats.mtime.getTime() || videoState.updated !== videoStats.birthtime.getTime() || videoState.filePath !== filePath || videoState.name !== name || videoState.category !== category || videoState.views === undefined || videoState.type !== type) {
      const newVideoList = videoList.filter((video) => { return video.fileName !== fileName; });
      const newVideoState: Video = {
        description: videoState.description,
        requireAuth: videoState.requireAuth,
        isFavorite: videoState.isFavorite,
        id: videoState.id,
        size: videoStats.size,
        uploaded: videoStats.mtime.getTime(),
        updated: videoStats.birthtime.getTime() ? videoStats.birthtime.getTime() : videoState.updated,
        mimeType,
        name,
        extentsion,
        fileName,
        filePath,
        thumbnailPath,
        category,
        views,
        type
      };
      newVideoList.push(newVideoState);
      setVideoList(newVideoList);
      return newVideoState;
    }
    return videoState;
  }

  // if not, create the state video and add persist it
  const newVideoState: Video = {
    fileName,
    name,
    size: videoStats.size,
    uploaded: videoStats.mtime.getTime(),
    updated: videoStats.birthtime.getTime() ? videoStats.birthtime.getTime() : Date.now(),
    extentsion,
    filePath,
    thumbnailPath,
    description: "",
    requireAuth: false,
    isFavorite: false,
    mimeType,
    category,
    id,
    views,
    type
  };

  videoList.push(newVideoState);
  setVideoList(videoList);
  return newVideoState;
};