// backend only config/storage code

import { Video } from "../utils/types";
import { booleanify } from "../utils/utils";
import config from "config";
import fse from "fs-extra";

export const getUserPassword = (): string | undefined => {
  return config.has("password") ? booleanify(config.get("password")) ? config.get("password") : undefined : undefined;
};

export const hasUserPassword = (): boolean => {
  return booleanify(getUserPassword());
};

export const getPrivateLibrary = (): boolean => {
  return booleanify(config.get("private_library"));
};

export const getThumnailSize = (): string => {
  return config.get("thumbnail_size") ?? "1980x1080";
};

export const getPath = async (): Promise<string> => {
  const dir = config.get("app_path") as string | undefined;
  if (dir)
    return checkCreateDir(dir);
  throw ("Required: \"path\" configuration property not found!");
};

export const getAssetsPath = async (): Promise<string> => {
  const dir = await getPath() + "/config/";
  return checkCreateDir(dir);
};

export const getBackupPath = async (): Promise<string> => {
  const dir = await getAssetsPath() + "/backups/";
  return checkCreateDir(dir);
};

export const getThumbnailsPath = async (): Promise<string> => {
  const dir = await getPath() + "/thumbnails/";
  return checkCreateDir(dir);
};

export const getVideosPath = async (): Promise<string> => {
  const dir = await getPath() + "/videos/";
  return checkCreateDir(dir);
};

export const getVideoListPath = async (): Promise<string> => {
  const dir = await getAssetsPath() + "video_list.json";
  if (!fse.existsSync(dir))
    await fse.writeJSON(dir, [{}]);
  return dir;
};

export const getBackupVideoListPath = async (): Promise<string> => {
  const dir = await getBackupPath() + "video_list.json";
  if (!fse.existsSync(dir))
    await fse.writeJSON(dir, [{}]);
  return dir;
};

export const setVideoList = async (list: Video[]): Promise<void> => {
  await fse.writeJSON(await getVideoListPath(), list);
};

export const getVideoList = async (): Promise<Video[]> => {
  return await fse.readJSON(await getVideoListPath()) as Video[];
};

export const createVideoListBackup = async (): Promise<void> => {
  const videoList = await getVideoList();
  await fse.writeJSON(await getBackupVideoListPath(), videoList);
};

export const deleteThumbnail = async (thumbnailName: string): Promise<void> => {
  await fse.unlink(await getThumbnailsPath() + thumbnailName);
};

const checkCreateDir = async (dir: string): Promise<string> => {
  if (!fse.existsSync(dir) || !await fse.pathExists(dir))
    await fse.mkdir(dir);
  return dir;
};