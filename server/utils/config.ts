import { Video } from "../../src/utils/types";

interface Config {
  password: string;
  privateLibrary: boolean;
  thumbnailSize: string;
}

export const getUserPassword = async (): Promise<string> => {
  return (await getConfig()).password;
};

export const getPrivateLibrary = async (): Promise<boolean> => {
  return (await getConfig()).privateLibrary;
};

export const getThumnailSize = async (): Promise<string> => {
  return (await getConfig()).thumbnailSize;
};

export const getPath = async (): Promise<string> => {
  const dir = "/blujay" as string | undefined;
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

export const getLibraryPath = async (): Promise<string> => {
  const dir = await getPath() + "/library/";
  return checkCreateDir(dir);
};

export const getVideoListPath = async (): Promise<string> => {
  const dir = await getAssetsPath() + "video_list.json";
  await checkCreateJSON(dir, [{}]);
  return dir;
};

export const getBackupVideoListPath = async (): Promise<string> => {
  const dir = await getBackupPath() + "video_list.json";
  await checkCreateJSON(dir, [{}]);
  return dir;
};

export const getConfigPath = async (): Promise<string> => {
  const dir = await getAssetsPath() + "config.json";

  const defaultConfig: Config = {
    password: "test",
    privateLibrary: true,
    thumbnailSize: "1920x1080"
  };

  await checkCreateJSON(dir, defaultConfig);
  return dir;
};

export const setVideoList = async (list: Video[]): Promise<void> => {
  const fse = await import("fs-extra");
  await fse.writeJSON(await getVideoListPath(), list);
};

export const getVideoList = async (): Promise<Video[]> => {
  const fse = await import("fs-extra");
  return await fse.readJSON(await getVideoListPath()) as Video[];
};

export const getConfig = async (): Promise<Config> => {
  const fse = await import("fs-extra");
  return await fse.readJSON(await getConfigPath()) as Config;
};

export const createVideoListBackup = async (): Promise<void> => {
  const fse = await import("fs-extra");
  const videoList = await getVideoList();
  await fse.writeJSON(await getBackupVideoListPath(), videoList);
};

export const deleteThumbnail = async (thumbnailName: string): Promise<void> => {
  const fse = await import("fs-extra");
  await fse.unlink(await getThumbnailsPath() + thumbnailName);
};

export const getDirListOfLibrarySubfolders = async (): Promise<string[]> => {
  const fse = await import("fs-extra");
  return (await fse.readdir(await getLibraryPath(), { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
};

const checkCreateJSON = async <T>(dir: string, defaultValue: T): Promise<string> => {
  const fse = await import("fs-extra");
  if (!fse.existsSync(dir))
    await fse.writeJSON(dir, defaultValue);
  return dir;
};

const checkCreateDir = async (dir: string): Promise<string> => {
  const fse = await import("fs-extra");
  if (!fse.existsSync(dir) || !await fse.pathExists(dir))
    await fse.mkdir(dir);
  return dir;
};