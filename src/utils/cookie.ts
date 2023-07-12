import { CookieTypes } from "./types";

interface CookieSetOptions {
  path: string;
  sameSite: boolean;
  maxAge: number;
  expires: Date;
}

export const getCookieSetOptions = (): CookieSetOptions => {
  return { path: "/", sameSite: true, maxAge: 31536000, expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) };
};

export const getCookieDefault = (name: CookieTypes): boolean | string | number => {
  switch (name) {
    case "isSidebarEnabled":
      return true;
    case "isTheaterMode":
      return false;
    case "videoVolume":
      return 1;
    case "isDarkMode":
      return true;
    case "authToken":
      return "";
  }
};

export const booleanify = (value: string | number | undefined): boolean => {
  if (value === "false" || value === "undefined" || value === "0" || value === "-0") {
    return false;
  }
  return !!value;
};