import * as mime from "mime-types";
import { Dimensions, Extentsions, Video, VideoType } from "@client/utils/types";
import { createVideoListBackup, getFileStat, getLibraryPath, getThumbnailsPath, getUserPassword, getVideoList, markVideoUnsupported, setVideoList } from "./config";
import { glob } from "glob";
import { imageExtensions } from "@client/utils/constants";
import { validateVideo } from "./validateVideo";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import seedrandom from "seedrandom";
import sizeOf from "image-size";


export const reindexVideoList = async (): Promise<void> => {
  createVideoListBackup();

  // get the filepaths of every video, while filtering out videos that fail to validate 
  const libraryPath = getLibraryPath();
  const videoFilePaths = await Promise.all((await glob(`${libraryPath}/*.*`)).filter(async filepath => {
    try {
      await validateVideo(filepath);
      return filepath;
    } catch (e: unknown) {
      console.warn("File Validation Failed: " + e + ". Marking file as unsupported.");
      markVideoUnsupported(filepath);
    }
  }));

  cleanState(videoFilePaths);

  for (const filePath of videoFilePaths) {
    await addFilepathToVideoList(filePath);
  }
};

export const generateVideoID = (filepath: string): string => {
  const filename = getName(filepath);
  return seedrandom(filename + getUserPassword())().toString().split(".").pop() as string;
};

export const getThumbnailFilepath = (filepath: string): string => {
  const id = generateVideoID(filepath);
  return path.join(getThumbnailsPath() + id + ".webp");
};

export const getThumbnailFilename = (filepath: string): string => {
  const id = generateVideoID(filepath);
  return path.join(id + ".webp");
};


const calculateImageDimensions = (filepath: string): Dimensions => {
  const dimensions = sizeOf(filepath);
  if (typeof dimensions.width === "number" && typeof dimensions.height === "number")
    return { width: dimensions.width, height: dimensions.height };

  return { width: 0, height: 0 };
};

const calulateVideoDimensions = async (filepath: string): Promise<Dimensions> => {
  const dimensions = await new Promise<ffmpeg.FfprobeStream>((res, rej) => ffmpeg.ffprobe(filepath, (err, metadata) => {
    if (err) {
      rej(err);
    } else {
      res(metadata.streams[0]);
    }
  }));

  if (typeof dimensions.width === "number" && typeof dimensions.height === "number")
    return { width: dimensions.width, height: dimensions.height };

  return { width: 0, height: 0 };
};

const getDimensions = (filepath: string): Promise<Dimensions> => {
  const type = getVideoType(filepath);

  if (type === "video") {
    return calulateVideoDimensions(filepath);
  }

  return new Promise<Dimensions>((res) => res(calculateImageDimensions(filepath)));
};

const getVideoType = (filepath: string): VideoType => {
  const extension = getExtentsion(filepath);
  if (imageExtensions.includes(extension)) {
    return "image";
  }
  if (extension === "gif") {
    return "gif";
  }
  return "video";
};


// returns the mime type of a video
const getMimeType = (filepath: string): string => {
  return mime.lookup(getFilename(filepath)) as string;
};

// removes any videos from the video list if they're not found in the file system
const cleanState = (filepaths: string[]): void => {
  const videoList = getVideoList();
  setVideoList(videoList.filter(video => filepaths.includes(video.filepath)));
};

// returns the file size of a video
const getSize = (filepath: string): number => {
  return getFileStat(filepath)?.size || 0;
};

// returns the upload date of a video
const getUploaded = (filepath: string): number => {
  return getFileStat(filepath)?.mtime.getTime() || 0;
};

// returns the update date of a video
const getUpdated = (filepath: string): number => {
  const updated = getFileStat(filepath)?.birthtime.getTime();
  return updated ? updated : Date.now();
};

// returns a new video object
const createNewVideo = async (filepath: string): Promise<Video> => {
  const dimensions = await getDimensions(filepath);

  return {
    thumbnailFilename: getThumbnailFilename(filepath),
    thumbnailFilepath: getThumbnailFilepath(filepath),
    extentsion: getExtentsion(filepath),
    uploaded: getUploaded(filepath),
    filename: getFilename(filepath),
    name: getName(filepath),
    mimeType: getMimeType(filepath),
    updated: getUpdated(filepath),
    id: generateVideoID(filepath),
    type: getVideoType(filepath),
    size: getSize(filepath),
    height: dimensions.height,
    width: dimensions.width,
    requireAuth: false,
    isFavorite: false,
    categories: [],
    description: "",
    views: 0,
    filepath,
  };
};

// returns the filename of a file including the extension (eg. "myVideo.mp4") 
const getFilename = (filepath: string): string => {
  return path.basename(filepath);
};

// returns the filename of a video excluding the extension (eg. "myVideo") 
const getName = (filepath: string): string => {
  return path.parse(getFilename(filepath)).name;
};

// returns the extentsion of a video 
const getExtentsion = (filepath: string): string => {
  return filepath.split(".").pop() as Extentsions;
};


// gets a video from videoList, creates one if not found
const addFilepathToVideoList = async (filepath: string): Promise<void> => {
  const videoList = getVideoList();
  const newVideo = await createNewVideo(filepath);
  const existingVideo = videoList.find((video) => { return video.id === newVideo.id; });

  if (!existingVideo) {
    videoList.push(newVideo);
    setVideoList(videoList);
  } else {
    let hasChanged = false;

    // only update the existing video if one of the following conditions are met
    const fieldsToCompare: Array<keyof Video> = ["mimeType", "thumbnailFilename", "thumbnailFilepath", "name", "filename", "filepath", "extentsion", "size", "updated", "uploaded", "filepath", "type", "height", "width"];

    fieldsToCompare.forEach(field => {
      if (existingVideo[field] !== newVideo[field]) {
        (existingVideo[field] as unknown) = newVideo[field];
        hasChanged = true;
      }
    });

    if (hasChanged) {
      const newVideoList = videoList.filter((video) => { return existingVideo.filename !== video.filename; });
      newVideoList.push(existingVideo);
      setVideoList(newVideoList);
    }
  }
};