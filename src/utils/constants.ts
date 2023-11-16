import { BluJayTheme } from "./types";

export const supportedVideoExtensions = ["mkv", "mp4", "webm", "mov", "mpeg", "avi", "avif", "wmv", "ogv", "m4v"];
export const supportedImageExtensions = ["gif", "jpg", "png", "jpeg", "webp", "jfif", "apng", "tiff", "tif", "bmp"];
export const supportedFileExtensions = [...supportedImageExtensions, ...supportedVideoExtensions] as const;
export const cookieOptions = ["isTheaterMode", "videoVolume", "authToken", "isSidebarEnabled"] as const;
export const queryField = ["name", "filename", "category", "description", "id"] as const;
export const viewType = ["List View", "Grid View"] as const;
export const sortOptions = ["Alphabetical", "Date Updated", "Date Uploaded", "File Size", "View Count"] as const;
export const sliderType = ["verticle", "horizontal"] as const;

export const blujayTheme: BluJayTheme = {
  background: "#0e0e0f",
  backgroundContrast: "#181819",
  text: "white",
  textContrast: "#868686",
  textContrastLight: "#8c8c8c",
  highlightLight: "#3c81eb",
  highlightDark: "#04befe",
  hightlightSilver: "#afdcff",
  button: "#272727",
} as const;

export const screenSizes = {
  largeScreenSize: 2560,
  mediumScreenSize: 1920,
  smallScreenSize: 1280,
  tabletScreenSize: 720,
  mobileScreenSize: 480,
} as const;