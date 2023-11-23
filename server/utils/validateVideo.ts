import { FileTypeResult, fileTypeFromFile } from "file-type";
import { fileMimeTypes } from "@client/utils/constants";
// import { getVideo } from "./config";
// import { glob } from "glob";

export const validateVideo = async (path: string): Promise<void> => {
  let meta: FileTypeResult | undefined;
  // let fileGlob: string[] | undefined;
  // let video: Buffer | undefined;

  try {
    [meta] = await Promise.all([fileTypeFromFile(path)]);
    //glob(path), getVideo(path)
  } catch {
    throw new Error("Failed to Retrieve File Details");
  }

  if (!meta || !fileMimeTypes.includes(meta.mime)) {
    throw new Error("Unsupported File Format");
  }
  // if (!fileGlob.length) {
  //   throw new Error("No Glob Found");
  // }
  // if (!video) {
  //   throw new Error("Video Not Found");
  // }
};