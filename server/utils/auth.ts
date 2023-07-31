import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import { Video } from "@client/utils/types";
import { randomBytes, scryptSync } from "crypto";

import { getPrivateLibrary, getUserPassword } from "./config";
import { listVideos } from "./listVideos";

export const getProtectedVideoList = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>): Promise<Video[]> => {
  const videoList = await listVideos();
  const authToken = ctx.req.cookies?.authToken;
  const authStatus = checkHashedPassword(authToken ?? "");

  if (authStatus) return videoList;
  else return videoList.filter((video) => !video.requireAuth);
};


export const authGuard = <T extends { [key: string]: unknown; }>(func: (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => Promise<GetServerSidePropsResult<T>>): GetServerSideProps<T, ParsedUrlQuery, PreviewData> => {

  const newFunc: GetServerSideProps<T, ParsedUrlQuery, PreviewData> = async (ctx) => {
    const authToken = ctx.req.cookies?.authToken ?? "";
    const isAuthenticated = checkHashedPassword(authToken);
    const isPrivateLibrary = getPrivateLibrary();

    if (!isAuthenticated) {
      if (authToken) ctx.res.setHeader("Set-Cookie", "authToken=; path=/;");
      if (isPrivateLibrary && !((ctx.req?.url ?? "") === "/login")) {
        ctx.res.writeHead(302, { Location: "/login" });
        ctx.res.end();
      }
    }

    return await func(ctx);
  };

  return newFunc;
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