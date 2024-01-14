import { NextPageContext } from "next";
import { Video } from "@client/utils/types";
import { getPrivateLibrary, getUserPassword } from "./config";
import { listVideos } from "./listVideos";
import { randomBytes, scryptSync } from "crypto";

export const getProtectedVideoList = async (ctx: NextPageContext, authToken: string): Promise<Video[]> => {
  const isAuthenticated = checkHashedPassword(authToken);
  const videoList = await listVideos();

  if (!isAuthenticated) {
    const isPrivateLibrary = getPrivateLibrary();

    if (authToken) ctx.res?.setHeader("Set-Cookie", "authToken=; path=/;");
    if (isPrivateLibrary && !((ctx.req?.url ?? "") === "/login")) {
      ctx.res?.writeHead(302, { Location: "/login" });
      ctx.res?.end();
      return [];
    }
  }

  if (isAuthenticated) return videoList;
  else return videoList.filter((video) => !video.requireAuth);
};

export const checkHashedPassword = (hashedPassword: string): boolean => {
  const configPassword = getUserPassword();

  if (!configPassword) {
    return true;
  }

  const salt = hashedPassword.slice(64);
  const hashedConfigPassword = scryptSync(configPassword, salt, 32).toString("hex") + salt;
  return hashedConfigPassword === hashedPassword;
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString("hex");
  return scryptSync(password, salt, 32).toString("hex") + salt;
};
