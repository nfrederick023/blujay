/*
 * API route for Video List
 */

import { NextApiRequest, NextApiResponse } from "next";
import VideoListController from "@server/api/videoList/videoList.controller";

const videoListAPI = (async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  VideoListController(req, res);
  res.end();
  return;
});

export default videoListAPI;