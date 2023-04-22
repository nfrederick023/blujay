import { IncomingMessage } from "http";

export interface BluJayTheme {
  readonly background: string;
  readonly backgroundContrast: string;
  readonly text: string;
  readonly textContrast: string;
  readonly textContrastLight: string;
  readonly highlightLight: string;
  readonly highlightDark: string;
}

export interface ScreenSizes {
  readonly largeScreenSize: number;
  readonly mediumScreenSize: number;
  readonly smallScreenSize: number;
  readonly tabletScreenSize: number;
  readonly mobileScreenSize: number;
}

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
  readonly mime?: string
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

