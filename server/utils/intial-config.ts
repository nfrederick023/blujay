import { reindexThumbnails } from "./thumbnail-service";
import { reindexVideoList } from "./video-service";
import ffmpeg from "fluent-ffmpeg";
import ffprobeStatic from "ffprobe-static";
import pathToFfmpeg from "ffmpeg-static";

ffmpeg.setFfprobePath(ffprobeStatic.path);
ffmpeg.setFfmpegPath(pathToFfmpeg ?? "");

const indexVideosAndThumbnails = async (): Promise<void> => {
  await reindexVideoList();
  await reindexThumbnails();
};

export default indexVideosAndThumbnails;