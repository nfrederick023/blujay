import { IncomingMessage } from "http";
import { Redirect } from "next/types";
import { cookieOptions, fileExtensions, sortOptions } from "./constants";

export interface BluJayTheme {
  readonly background: string;
  readonly backgroundContrast: string;
  readonly text: string;
  readonly textContrast: string;
  readonly textContrastLight: string;
  readonly highlightLight: string;
  readonly highlightDark: string;
  readonly hightlightSilver: string;
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
  readonly category: string,
  readonly description: string,
  readonly requireAuth: boolean,
  readonly isFavorite: boolean,
  readonly id: string,
  readonly mimeType: string
  readonly extentsion: Extentsions;
  readonly views: number;
  readonly type: VideoType;
}

export enum AuthStatus {
  authenticated,
  notAuthenticated
}

export enum LinkTypes {
  publicLink,
  privateLink,
  favoriteLink,
  unfavoriteLink,
  copyLink,
  favoriteLinkNoAuth
}

export interface PropsWithAuth {
  readonly authStatus: AuthStatus
}

export interface IncomingMessageCookies extends IncomingMessage {
  readonly cookies: { [key: string]: string | boolean | number };
}

export interface NextRedirect {
  readonly redirect: Redirect
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
}

// DO NOT ALLOW SENSITIVE PARAMETERS IN PUBLICCONFIG!!!!! 
export interface PublicConfig {
  readonly thumbnailSettings: Thumbnail;
}

export type Extentsions = typeof fileExtensions[number];
export type CookieTypes = typeof cookieOptions[number]
export type SortType = typeof sortOptions[number];
export type OrderType = "Ascending" | "Descending";
export type QueryField = "name" | "filename" | "category" | "description" | "id";
export type ViewType = "List View" | "Grid View";
export type SliderType = "verticle" | "horizontal";
export type VideoType = "video" | "image" | "gif";
