
import { NextApiRequest, NextApiResponse } from "next";
import LoginController from "@server/api/login/login.controller";

const loginAPI = (async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await LoginController(req, res);
});

export default loginAPI;

