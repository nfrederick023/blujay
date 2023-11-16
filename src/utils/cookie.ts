import { CookieSetOptions } from "universal-cookie";
import { CookieTypes } from "./types";

export const getCookieSetOptions = (isSession?: boolean): CookieSetOptions => {
  const maxAge = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).getTime(); // current date + 1 year
  const cookieSetOptions: CookieSetOptions = { path: "/", sameSite: true };

  if (!isSession) {
    cookieSetOptions.maxAge = maxAge;
  }

  return cookieSetOptions;
};

export const getCookieDefault = (name: CookieTypes): boolean | string | number => {
  switch (name) {
    case "isSidebarEnabled":
      return true;
    case "isTheaterMode":
      return false;
    case "videoVolume":
      return 1;
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