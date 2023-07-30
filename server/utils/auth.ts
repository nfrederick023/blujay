import { Video } from "@client/utils/types";
import { randomBytes, scryptSync } from "crypto";

import { getUserPassword, getVideoList } from "./config";

export const getProtectedVideoList = (authToken: string): Video[] => {
  const videoList = getVideoList();
  const authStatus = checkHashedPassword(authToken);

  if (authStatus) return videoList;
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