import { SupportedExtentsions } from "./types";
import { supportedImageExtensions, supportedVideoExtensions } from "./constants";

export const getMediaType = (ext: SupportedExtentsions): "gif" | "video" | "image" | "other" => {
  if (ext === "gif") {
    return "gif";
  }
  if (supportedImageExtensions.includes(ext)) {
    return "image";
  }
  if (supportedVideoExtensions.includes(ext)) {
    return "video";
  }

  return "other";
};