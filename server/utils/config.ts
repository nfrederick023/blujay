import { Config, Thumbnail, Video } from "../../src/utils/types";
import fs from "fs-extra";

export const getUserPassword = (): string => {
  return (getConfig()).password;
};

export const getPrivateLibrary = (): boolean => {
  return (getConfig()).privateLibrary;
};

export const getThumnailSettings = (): Thumbnail => {
  return (getConfig()).thumbnailSettings;
};

export const getDataPath = (): string => {
  const dir = "/data" as string | undefined;
  if (dir)
    return checkCreateDir(dir);
  throw ("Required: \"path\" configuration property not found!");
};

export const getPath = (): string => {
  const dir = getDataPath() + "/blujay/";
  return checkCreateDir(dir);
};

export const getAssetsPath = (): string => {
  const dir = getPath() + "/config/";
  return checkCreateDir(dir);
};

export const getBackupPath = (): string => {
  const dir = getAssetsPath() + "/backups/";
  return checkCreateDir(dir);
};

export const getThumbnailsPath = (): string => {
  const dir = getPath() + "/thumbnails/";
  return checkCreateDir(dir);
};

export const getLibraryPath = (): string => {
  const dir = getPath() + "/library/";
  return checkCreateDir(dir);
};

export const getVideoListPath = (): string => {
  const dir = getAssetsPath() + "video_list.json";
  checkCreateJSON(dir, []);
  return dir;
};

export const getBackupVideoListPath = (): string => {
  const dir = getBackupPath() + "video_list.json";
  checkCreateJSON(dir, []);
  return dir;
};

export const getConfigPath = (): string => {
  const dir = getAssetsPath() + "config.json";

  const defaultConfig: Config = {
    password: "test",
    privateLibrary: true,
    thumbnailSettings: {
      width: 1920,
      height: 1080,
    }
  };

  checkCreateJSON(dir, defaultConfig);
  return dir;
};

export const setVideoList = (list: Video[]): void => {
  fs.writeJSONSync(getVideoListPath(), list);
};

export const getVideoList = (): Video[] => {
  return fs.readJSONSync(getVideoListPath()) as Video[];
};

export const deleteVideo = (path: string): void => {
  fs.removeSync(path);
};

export const getVideo = (path: string): Buffer => {
  return fs.readFileSync(path);
};


export const getConfig = (): Config => {
  return fs.readJSONSync(getConfigPath()) as Config;
};

export const createVideoListBackup = (): void => {
  const videoList = getVideoList();
  fs.writeJSONSync(getBackupVideoListPath(), videoList);
};

export const deleteThumbnail = (thumbnailName: string): void => {
  fs.unlinkSync(getThumbnailsPath() + thumbnailName);
};

export const getDirListOfLibrarySubfolders = (): string[] => {
  return (fs.readdirSync(getLibraryPath(), { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
};

const checkCreateJSON = <T>(dir: string, defaultValue: T): string => {
  if (!fs.existsSync(dir))
    fs.writeJSONSync(dir, defaultValue);
  return dir;
};

const checkCreateDir = (dir: string): string => {
  if (!fs.existsSync(dir) || !fs.pathExistsSync(dir))
    fs.mkdirSync(dir);
  return dir;
};