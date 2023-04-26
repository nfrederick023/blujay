import { randomBytes, scryptSync } from "crypto";

import { AuthStatus } from "../../src/utils/types";
import { getUserPassword } from "./config";

const getAuthStatus = (token: string | undefined): AuthStatus => {
  if (isTokenValid(token))
    return AuthStatus.authenticated;
  return AuthStatus.notAuthenticated;
};

export const isTokenValid = (authToken: string | undefined): boolean => {
  return checkHashedPassword("default", authToken ?? "");
};

export const checkHashedPassword = (user: string, hashedPassword: string): boolean => {
  const configPassword = getUserPassword();

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