import { createVideoListBackup, deleteThumbnail, getThumbnailsPath, getThumnailSize, getUserPassword, getVideoList, getVideosPath, setVideoList } from "./config";
import glob from "glob";
import path from "path";
import seedrandom from "seedrandom";

import { Video } from "@client/types/types";
import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";
import fse from "fs-extra";
import pathToFfmpeg from "ffmpeg-static";
ffmpeg.setFfprobePath(ffprobeStatic.path);
ffmpeg.setFfmpegPath(pathToFfmpeg ?? "");

export const listVideos = async (): Promise<Video[]> => {
  await createVideoListBackup();

  let videos = glob.sync(`${await getVideosPath()}/*.@(mkv|mp4|webm|mov|mpeg|avi|wmv|json)`);

  // Remove metadata files from the video list
  videos = videos.filter((videoPath) => !videoPath.endsWith(".json"));
  await cleanState();

  const videoDetails: Video[] = [];
  for (const filePath of videos) {
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
      ffmpeg(video.filePath)
        .screenshots({
          count: 1,
          filename,
          folder,
          size
        });
    }
  });

  oldThumbnails.forEach(thumbnail => deleteThumbnail(thumbnail));
};

// removes any videos not found in state
const cleanState = async (): Promise<void> => {
  const videoList = await getVideoList();
  const files = await fse.readdir(await getVideosPath());
  await setVideoList(videoList.filter(video => files.includes(video.fileName)));
};

// gets a video from videoList, creates one if not found
const getCreateVideo = async (filePath: string): Promise<Video | null> => {
  const fileName = path.basename(filePath);
  const name = path.parse(fileName).name;
  const videoStats = await fse.stat(filePath);
  const videoList = await getVideoList();
  const thumbnailPath = path.join(await getThumbnailsPath() + name + ".jpg");

  // check if the video already is persisted within the state
  const videoState = videoList.find((video) => { return video.fileName === fileName; });

  if (videoState) {

    // reindex if any of the following values don't match for whatever reason
    if (videoState.size !== videoStats.size || videoState.saved !== videoStats.mtimeMs || videoState.created !== videoStats.birthtimeMs || videoState.filePath !== filePath || videoState.name !== name) {
      const newVideoList = videoList.filter((video) => { return video.fileName !== fileName; });
      const newVideoState: Video = {
        ...videoState,
        size: videoStats.size,
        saved: videoStats.mtimeMs,
        created: videoStats.birthtimeMs ? videoStats.birthtimeMs : videoState.created,
        name,
        filePath,
        thumbnailPath,
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
    saved: videoStats.mtimeMs,
    created: videoStats.birthtimeMs ? videoStats.birthtimeMs : Date.now(),
    filePath: filePath,
    thumbnailPath,
    description: "",
    requireAuth: false,
    isFavorite: false,
    id
  };
  videoList.push(newVideoState);

  await setVideoList(videoList);
  return newVideoState;
};