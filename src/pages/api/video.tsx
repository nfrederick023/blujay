import { NextApiRequest, NextApiResponse } from "next";
import VideoController from "@server/api/video/video.controller";

const videoAPI = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await VideoController(req, res);
};

export default videoAPI;
