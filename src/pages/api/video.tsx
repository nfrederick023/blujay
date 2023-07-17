/*
 * API route for Single videos
 */

import { NextApiRequest, NextApiResponse } from "next";
import VideoController from "@server/api/video/video.controller";

const videoListAPI = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await VideoController(req, res);
};

export default videoListAPI;
