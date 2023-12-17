import * as mime from "mime-types";
import { Extentsions, Video, VideoType } from "@client/utils/types";
import { createVideoListBackup, deleteThumbnail, getLibraryPath, getThumbnailsPath, getUserPassword, getVideoList, markVideoUnsupported, setVideoList } from "./config";
import { fileTypeFromFile } from "file-type";
import { glob } from "glob";
import { imageExtensions } from "@client/utils/constants";
import { validateVideo } from "./validateVideo";
import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";
import fs from "fs";
import path from "path";
import pathToFfmpeg from "ffmpeg-static";
import seedrandom from "seedrandom";

ffmpeg.setFfprobePath(ffprobeStatic.path);
ffmpeg.setFfmpegPath(pathToFfmpeg ?? "");

export const listVideos = async (): Promise<Video[]> => {
  createVideoListBackup();

  const libraryPath = getLibraryPath();
  let videoFilePaths = await glob(`${libraryPath}/**/*.*`);
  let validationFailed = false;

  await Promise.all(videoFilePaths.map(async file => {
    try {
      await validateVideo(file);
    } catch (e: unknown) {
      validationFailed = true;
      console.warn("File Validation Failed: " + e + ". Marking file as unsupported.");
      markVideoUnsupported(file);
    }
  }));

  if (validationFailed) {
    videoFilePaths = await glob(`${libraryPath}/**/*.*`);
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

const createThumbnails = async (videos: Video[]): Promise<Video[]> => {
  const sizeReductionPercent = 50;
  const folder = getThumbnailsPath();
  const thumbnails = fs.readdirSync(folder);
  let oldThumbnails = thumbnails;
  const newVideoList = await Promise.all(videos.filter(async video => {
    const filename = video.id + ".webp";
    oldThumbnails = oldThumbnails.filter(thumbnail => !(thumbnail === filename));

    // if the thumbnail is bad we will get undefined, this will tell us to generate a new one
    if (!thumbnails.includes(filename) || !await fileTypeFromFile(folder + filename)) {
      let timemarks = ["10%"];

      if (video.type === "gif") {
        timemarks = ["0"];
      }
      return await new Promise<Video | boolean>((res) => {
        if ((video.type === "video" || video.type === "gif")) {
          ffmpeg(video.filePath)
            .inputOptions("-t 10")
            .on("error", () => {
              console.warn("Failed to generate thumbnail for " + video.filePath + ". Marking files as unsupported.");
              markVideoUnsupported(video.filePath);
              res(false);
            })
            .on("exit", () => {
              res(true);
            })
            .screenshots({
              count: 1,
              filename,
              folder,
              size: `${sizeReductionPercent}%`,
              timemarks
            });

        } else {
          ffmpeg(video.filePath).output(folder + filename)
            .outputOptions(["-preset", "default", "-vf", `scale=iw*0.${sizeReductionPercent}:ih*0.${sizeReductionPercent}`]).on("error", () => {
              console.warn("Failed to generate thumbnail for " + video.filePath + ". Marking files as unsupported.");
              markVideoUnsupported(video.filePath);
              res(false);
            }).on("exit", () => {
              res(true);
            }).run();
        }
      });
    }
  }));

  oldThumbnails.forEach(thumbnail => deleteThumbnail(thumbnail));
  return (newVideoList);
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
  const videoStats = fs.statSync(filePath);
  const mimeType = mime.lookup(fileName) as string;
  const views = 0;

  const videoList = getVideoList();
  let category = path.dirname(filePath).split("\\").pop() ?? "";
  const extentsion = fileName.split(".").pop() as Extentsions;
  let type: VideoType = "video";

  if (imageExtensions.includes(extentsion)) {
    type = "image";
  }

  if (extentsion === "gif") {
    type = "gif";
  }

  if (category === "library")
    category = "";

  const id = seedrandom(fileName + category + getUserPassword())().toString().split(".").pop() as string;
  let thumbnailPath = path.join(getThumbnailsPath() + id + ".webp");

  // check if the video already is persisted within the state
  const videoState = videoList.find((video) => { return video.filePath === filePath; });

  if (videoState) {
    thumbnailPath = path.join(getThumbnailsPath() + videoState.id + ".webp");

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