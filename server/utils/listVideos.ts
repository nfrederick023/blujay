import { createVideoListBackup, deleteThumbnail, getLibraryPath, getThumbnailsPath, getThumnailSize, getUserPassword, getVideoList, setVideoList } from "./config";
import path from "path";
import seedrandom from "seedrandom";

import { Video } from "@client/utils/types";
import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";
import fse from "fs-extra";
import glob from "glob-promise";
import pathToFfmpeg from "ffmpeg-static";
ffmpeg.setFfprobePath(ffprobeStatic.path);
ffmpeg.setFfmpegPath(pathToFfmpeg ?? "");

export const listVideos = async (): Promise<Video[]> => {
  await createVideoListBackup();

  const libraryPath = await getLibraryPath();
  const videoFilePaths = await glob.promise(`${libraryPath}/**/*.@(mkv|mp4|webm|mov|mpeg|avi|wmv|gif)`);

  await cleanState(videoFilePaths);

  const videoDetails: Video[] = [];
  for (const filePath of videoFilePaths) {
    const videoState = await getCreateVideo(filePath);
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
  const folder = await getThumbnailsPath();
  const thumbnails = await fse.readdir(folder);
  const size = await getThumnailSize();
  let oldThumbnails = thumbnails;

  videos.forEach(video => {
    const filename = video.name + ".jpg";
    oldThumbnails = oldThumbnails.filter(thumbnail => !(thumbnail === filename));
    if (!thumbnails.includes(filename)) {
      let timemarks = ["20%"];
      if (video.fileName.split(".").pop() === "gif")
        timemarks = ["0"];
      ffmpeg(video.filePath)
        .inputOptions("-t 10")
        .screenshots({
          count: 1,
          filename,
          folder,
          size,
          timemarks
        });
    }
  });

  oldThumbnails.forEach(thumbnail => deleteThumbnail(thumbnail));
};

// removes any videos in the video list that are not found
const cleanState = async (videoFilePaths: string[]): Promise<void> => {
  const videoList = await getVideoList();
  await setVideoList(videoList.filter(video => videoFilePaths.includes(video.filePath)));
};

// gets a video from videoList, creates one if not found
const getCreateVideo = async (filePath: string): Promise<Video | null> => {
  const fileName = path.basename(filePath);
  const name = path.parse(fileName).name;
  const videoStats = await fse.stat(filePath);
  const videoList = await getVideoList();
  const category = path.dirname(filePath).split("\\")[3] ?? "";
  const thumbnailPath = path.join(await getThumbnailsPath() + name + ".jpg");

  // check if the video already is persisted within the state
  const videoState = videoList.find((video) => { return video.filePath === filePath; });

  if (videoState) {

    // reindex if any of the following values don't match for whatever reason
    if (videoState.size !== videoStats.size || videoState.saved !== videoStats.mtime.getTime() || videoState.created !== videoStats.birthtime.getTime() || videoState.filePath !== filePath || videoState.name !== name || videoState.category !== category) {
      const newVideoList = videoList.filter((video) => { return video.fileName !== fileName; });
      const newVideoState: Video = {
        ...videoState,
        size: videoStats.size,
        saved: videoStats.atime.getTime(),
        created: videoStats.birthtime.getTime() ? videoStats.birthtime.getTime() : videoState.created,
        name,
        fileName,
        filePath,
        thumbnailPath,
        category
      };
      newVideoList.push(newVideoState);
      await setVideoList(newVideoList);
      return newVideoState;
    }

    return videoState;
  }

  // if not, create the state video and add persist it
  const id = parseInt((seedrandom(fileName + getUserPassword())() * 9e7 + 1e7).toString()).toString();
  const newVideoState: Video = {
    fileName,
    name,
    size: videoStats.size,
    saved: videoStats.mtime.getTime(),
    created: videoStats.birthtime.getTime() ? videoStats.birthtime.getTime() : Date.now(),
    filePath,
    thumbnailPath,
    description: "",
    requireAuth: false,
    isFavorite: false,
    category,
    id
  };
  videoList.push(newVideoState);

  await setVideoList(videoList);
  return newVideoState;
};