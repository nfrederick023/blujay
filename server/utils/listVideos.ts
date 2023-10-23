import * as mime from "mime-types";
import { SupportedExtentsions, Video } from "@client/utils/types";
import { createVideoListBackup, deleteThumbnail, getLibraryPath, getThumbnailsPath, getUserPassword, getVideoList, setVideoList } from "./config";
import { isMediaTypeVideo } from "@client/utils/checkMediaType";
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
  const videoFilePaths = await glob.promise(`${libraryPath}/**/*.@(mkv|mp4|webm|mov|mpeg|avi|wmv|gif|jpg|png|jpeg)`);
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
  const folder = getThumbnailsPath();
  const thumbnails = await fse.readdir(folder);
  let oldThumbnails = thumbnails;
  videos.forEach(video => {
    const filename = video.id + ".jpg";
    oldThumbnails = oldThumbnails.filter(thumbnail => !(thumbnail === filename));
    if (!thumbnails.includes(filename)) {
      if (isMediaTypeVideo(video.extentsion) || video.extentsion === "gif") {
        const timemarks = video.extentsion === "gif" ? ["0"] : ["20%"];
        ffmpeg(video.filePath)
          .inputOptions("-t 10")
          .screenshots({
            count: 1,
            filename,
            folder,
            timemarks
          });
      }
    }
  });

  oldThumbnails.forEach(thumbnail => deleteThumbnail(thumbnail));
};

// removes any videos in the video list that are not found
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

  const videoList = getVideoList();
  let category = path.dirname(filePath).split("\\").pop() ?? "";
  const extentsion = fileName.split(".").pop() as SupportedExtentsions;
  const id = parseInt((seedrandom(fileName + getUserPassword())() * 9e7 + 1e7).toString()).toString();
  const thumbnailPath = isMediaTypeVideo(extentsion) || extentsion === "gif" ? path.join(getThumbnailsPath() + id + ".jpg") : filePath;

  if (category === "library")
    category = "";

  // check if the video already is persisted within the state
  const videoState = videoList.find((video) => { return video.filePath === filePath; });

  if (videoState) {

    // reindex if any of the following values don't match for whatever reason
    if (videoState.mimeType !== mimeType || videoState.thumbnailPath !== thumbnailPath || videoState.extentsion !== extentsion || videoState.size !== videoStats.size || videoState.saved !== videoStats.mtime.getTime() || videoState.created !== videoStats.birthtime.getTime() || videoState.filePath !== filePath || videoState.name !== name || videoState.category !== category) {
      const newVideoList = videoList.filter((video) => { return video.fileName !== fileName; });
      const newVideoState: Video = {
        description: videoState.description,
        requireAuth: videoState.requireAuth,
        isFavorite: videoState.isFavorite,
        id: videoState.id,
        size: videoStats.size,
        saved: videoStats.mtime.getTime(),
        created: videoStats.birthtime.getTime() ? videoStats.birthtime.getTime() : videoState.created,
        mimeType,
        name,
        extentsion,
        fileName,
        filePath,
        thumbnailPath,
        category
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
    saved: videoStats.mtime.getTime(),
    created: videoStats.birthtime.getTime() ? videoStats.birthtime.getTime() : Date.now(),
    extentsion,
    filePath,
    thumbnailPath,
    description: "",
    requireAuth: false,
    isFavorite: false,
    mimeType,
    category,
    id
  };

  videoList.push(newVideoState);
  setVideoList(videoList);
  return newVideoState;
};