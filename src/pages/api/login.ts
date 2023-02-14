/**
 * Login handler
 */

import { Request, Response } from "express";

import { getUserPassword, hasUserPassword } from "../../backend/config";
import { hashPassword } from "../../../server/utils/auth";

const login = async (req: Request, res: Response): Promise<void> => {

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end();
    return;
  }

  const userPassword = getUserPassword();

  if (!hasUserPassword()) {
    res.statusCode = 400;
    res.end("User authentication not configured!");
    return;
  }

  if (req.body && "password" in req.body && userPassword === req.body["password"] && userPassword) {
    const hashedPassword = await hashPassword(userPassword);
    res.statusCode = 200;
    res.end(JSON.stringify({ authToken: hashedPassword }));
    return;
  }

  res.statusCode = 401;
  res.end("Login Failed!");
  return;
};

export default login;