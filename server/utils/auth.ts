import { randomBytes, scryptSync } from "crypto";

import { AuthStatus } from "../../src/utils/types";
import { GetServerSidePropsContext, NextApiRequest, NextPageContext, PreviewData } from "next";
import { IncomingMessage } from "http";
import { ParsedUrlQuery } from "querystring";
import { getUserPassword } from "./config";

type RequestCookes = IncomingMessage & {
  cookies: Partial<{
    [key: string]: string;
  }>;
};

const getAuthStatus = async (ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData> | NextPageContext): Promise<AuthStatus> => {

  const hasAuthToken = !!(ctx.req as NextApiRequest | undefined)?.cookies.authToken;
  const isAuthTokenValid = await isTokenValid((ctx.req as RequestCookes).cookies.authToken);

  if (hasAuthToken && !isAuthTokenValid && ctx.res) {
    ctx.res.setHeader("Set-Cookie", "authToken=; Max-Age=0");
    ctx.res.setHeader("Location", "/login");
  }

  if (isAuthTokenValid)
    return AuthStatus.authenticated;

  return AuthStatus.notAuthenticated;
};

export const isTokenValid = async (authToken: string | undefined): Promise<boolean> => {
  return await checkHashedPassword("default", authToken ?? "");
};

export const checkHashedPassword = async (user: string, hashedPassword: string): Promise<boolean> => {
  const configPassword = await getUserPassword();

  if (!configPassword) {
    return false;
  }

  const salt = hashedPassword.slice(64);
  const hashedConfigPassword = scryptSync(configPassword, salt, 32).toString("hex") + salt;
  return hashedConfigPassword === hashedPassword;
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString("hex");
  return scryptSync(password, salt, 32).toString("hex") + salt;
};

export default getAuthStatus;