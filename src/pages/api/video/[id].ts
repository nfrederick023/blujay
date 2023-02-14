import { NextApiRequest, NextApiResponse } from "next";
import getVideoByID from "../watch/[id]";

const oldVideoAPI = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  req.url = req.url + ".mp4";
  getVideoByID(req, res);
};

export default oldVideoAPI;