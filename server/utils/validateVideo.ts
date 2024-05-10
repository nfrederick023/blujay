import { FileTypeResult, fileTypeFromFile } from "file-type";
import { fileMimeTypes } from "@client/utils/constants";

export const validateVideo = async (path: string): Promise<void> => {
  let meta: FileTypeResult | undefined;

  try {
    [meta] = await Promise.all([fileTypeFromFile(path)]);
  } catch {
    throw new Error("Failed to Retrieve File Details");
  }

  if (!meta || !fileMimeTypes.includes(meta.mime)) {
    throw new Error("Unsupported File Format");
  }
};