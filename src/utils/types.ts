import { IncomingMessage } from "http";
import { Redirect } from "next/types";

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

export interface ScreenSizes {
  /**
   * 2560 Pixels
   */
  readonly largeScreenSize: number;
  /**
   * 1920 Pixels
   */
  readonly mediumScreenSize: number;
  /**
   * 1280 Pixels
   */
  readonly smallScreenSize: number;
  /**
   * 720 Pixels
   */
  readonly tabletScreenSize: number;

  /**
   * 480 Pixels
   */
  readonly mobileScreenSize: number;
}

export type SupportedExtentsions = "mkv" | "mp4" | "webm" | "mov" | "mpeg" | "avi" | "wmv" | "gif" | "jpg" | "png" | "jpeg";

export interface Video {
  readonly fileName: string,
  readonly name: string,
  readonly size: number,
  readonly saved: number,
  readonly created: number,
  readonly filePath: string,
  readonly thumbnailPath: string,
  readonly category: string,
  readonly description: string,
  readonly requireAuth: boolean,
  readonly isFavorite: boolean,
  readonly id: string,
  readonly mimeType: string
  readonly extentsion: SupportedExtentsions;
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
  redirect: Redirect
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

// DO NOT ALLOW SENSITIVE PARAMETERS IN PUBLICCONFIG!!!!! 
export interface PublicConfig {
  readonly thumbnailSettings: Thumbnail;
}


// re-add "isDarkMode" for darkmode implementation
export type CookieTypes = "isTheaterMode" | "videoVolume" | "authToken" | "isSidebarEnabled"
export type OrderType = "Ascending" | "Descending";
export type QueryField = "name" | "filename" | "category" | "description" | "id";
export type ViewType = "List View" | "Grid View";
export type SortType =
  | "Alphabetical"
  | "Date Updated"
  | "Date Created"
  | "File Size"
  | "View Count";
