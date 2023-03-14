import { IncomingMessage } from "http";
import { Redirect } from "next";

export interface Video {
  fileName: string,
  name: string,
  size: number,
  saved: number,
  created: number,
  filePath: string,
  thumbnailPath: string,
  category: string,
  description: string,
  requireAuth: boolean,
  isFavorite: boolean,
  id: string,
  mime?: string
}

export interface Props<T> {
  props: T
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

export enum SortTypes {
  created = "created",
  saved = "saved",
  name = "name",
  size = "size"
}

export interface PropsWithAuth {
  authStatus: AuthStatus
}

export interface IncomingMessageCookies extends IncomingMessage {
  cookies: { [key: string]: string | boolean | number };
}

export interface NextRedirect {
  redirect: Redirect
}

export interface AuthResponse extends Response {
  authToken: string
}


