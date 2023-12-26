import { cookieOptions, fileExtensions, orderOptions, sortOptions } from "./constants";

export interface BluJayTheme {
  readonly background: string;
  readonly backgroundContrast: string;
  readonly text: string;
  readonly textContrast: string;
  readonly textContrastLight: string;
  readonly highlightDark: string;
  readonly highlightLight: string;
  readonly hightlightSilver: string;
  readonly error: string;
  readonly button: string;
}

export interface Video {
  readonly fileName: string,
  readonly name: string,
  readonly size: number,
  readonly uploaded: number,
  readonly updated: number,
  readonly filePath: string,
  readonly thumbnailPath: string,
  readonly categories: string[],
  readonly description: string,
  readonly requireAuth: boolean,
  readonly isFavorite: boolean,
  readonly id: string,
  readonly mimeType: string
  readonly extentsion: Extentsions;
  readonly views: number;
  readonly type: VideoType;
  readonly height: number;
  readonly width: number;
}

export interface Thumbnail {
  height: number,
  width: number
}

export interface Config {
  readonly password: string;
  readonly privateLibrary: boolean;
  readonly thumbnailSettings: Thumbnail;
}

export interface FileUpload {
  filename: string;
  progress: number;
  uploadStatus: "IN_PROGESS" | "FAILED" | "COMPLETE";
  error: string;
}

// DO NOT ALLOW SENSITIVE PARAMETERS IN PUBLICCONFIG!!!!! 
export interface PublicConfig {
  readonly thumbnailSettings: Thumbnail;
}

export interface DropDownOption {
  text: string;
  icon?: string;
  action: (e: React.MouseEvent) => void;
}

export type KeepAliveComponenet = (props?: unknown) => JSX.Element;
export type Extentsions = typeof fileExtensions[number];
export type CookieTypes = typeof cookieOptions[number]
export type SortType = typeof sortOptions[number];
export type OrderType = typeof orderOptions[number];
export type QueryField = "name" | "filename" | "category" | "description" | "id";
export type ViewType = "List View" | "Grid View";
export type SliderType = "verticle" | "horizontal";
export type VideoType = "video" | "image" | "gif";
export type CookieObject = { [key: string]: string };
