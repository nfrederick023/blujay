import { NextApiRequest, NextApiResponse } from "next";
import VideoListController from "@server/api/videoList/videoList.controller";

const videoListAPI = (async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await VideoListController(req, res);
});

export default videoListAPI;