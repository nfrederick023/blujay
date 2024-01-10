import { Config, Thumbnail, Video } from "../../src/utils/types";
import fs from "fs";

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
  const dir = "/data/" as string | undefined;
  if (dir)
    return checkCreateDir(dir);
  throw ("Required: \"path\" configuration property not found!");
};

export const getPath = (): string => {
  const dir = getDataPath() + "blujay/";
  return checkCreateDir(dir);
};

export const getAssetsPath = (): string => {
  const dir = getPath() + "config/";
  return checkCreateDir(dir);
};

export const getBackupPath = (): string => {
  const dir = getAssetsPath() + "backups/";
  return checkCreateDir(dir);
};

export const getThumbnailsPath = (): string => {
  const dir = getPath() + "thumbnails/";
  return checkCreateDir(dir);
};

export const getLibraryPath = (): string => {
  const dir = getPath() + "library/";
  return checkCreateDir(dir);
};

export const getUnsupportedPath = (): string => {
  const dir = getAssetsPath() + "unsupported/";
  return checkCreateDir(dir);
};

export const getTempPath = (): string => {
  const dir = getAssetsPath() + "temp/";
  return checkCreateDir(dir);
};


export const getVideoListPath = (): string => {
  const dir = getAssetsPath() + "video_list.json";
  checkCreateJSON(dir, "[]");
  return dir;
};

export const getBackupVideoListPath = (): string => {
  const dir = getBackupPath() + "video_list.json";
  checkCreateJSON(dir, "[]");
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

  checkCreateJSON(dir, JSON.stringify(defaultConfig));
  return dir;
};

export const setVideoList = (list: Video[]): void => {
  fs.writeFileSync(getVideoListPath(), JSON.stringify(list), "utf-8");
};

export const getVideoList = (): Video[] => {
  return JSON.parse(fs.readFileSync(getVideoListPath(), "utf-8")) as Video[];
};

export const deleteVideo = (path: string): void => {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { force: true });
  }
};

export const renameVideoFile = (path: string, newName: string): void => {
  if (fs.existsSync(path)) {
    fs.renameSync(path, newName);
  }
};

export const getVideo = (path: string): Buffer | undefined => {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path);
  }
};

export const moveVideoToLibrary = (path: string): void => {
  if (fs.existsSync(path)) {
    const filename = path.split("\\").pop();
    fs.renameSync(path, getLibraryPath() + filename);
  }
};

export const markVideoUnsupported = (path: string): void => {
  if (fs.existsSync(path)) {
    const filename = path.split("\\").pop();
    fs.renameSync(path, getUnsupportedPath() + filename);
  }
};

export const moveVideoFromTemp = (path: string): void => {
  if (fs.existsSync(path)) {
    const filename = path.split("\\").pop();
    fs.renameSync(path, getUnsupportedPath() + filename);
  }
};

export const getConfig = (): Config => {
  return JSON.parse(fs.readFileSync(getVideoListPath(), "utf-8")) as Config;
};

export const createVideoListBackup = (): void => {
  const videoList = getVideoList();
  fs.writeFileSync(getBackupVideoListPath(), JSON.stringify(videoList), "utf-8");
};

export const deleteThumbnail = (thumbnailName: string): void => {
  fs.unlinkSync(getThumbnailsPath() + thumbnailName);
};

export const getDirListOfLibrarySubfolders = (): string[] => {
  return (fs.readdirSync(getLibraryPath(), { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
};

const checkCreateJSON = <T extends string>(dir: string, defaultValue: T): string => {
  if (!fs.existsSync(dir))
    fs.writeFileSync(dir, defaultValue, "utf-8");
  return dir;
};

const checkCreateDir = (dir: string): string => {
  if (!fs.existsSync(dir) || !fs.existsSync(dir))
    fs.mkdirSync(dir);
  return dir;
};