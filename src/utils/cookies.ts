interface CookieSetOptions {
  path: string;
  sameSite: boolean;
  maxAge: number;
  expires: Date;
}

export const getCookieSetOptions = (): CookieSetOptions => {
  return { path: "/", sameSite: true, maxAge: 31536000, expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) };
};

export const getCookieDefault = (name: string): boolean | string | number => {
  switch (name) {
    case "theaterMode":
      return false;
    case "videoVolume":
      return 1;
    case "videosPerPage":
      return 20;
    case "isDarkMode":
      return true;
    case "authToken":
      return "";
    default:
      return "";
  }
};