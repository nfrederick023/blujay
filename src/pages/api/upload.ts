import { NextApiRequest, NextApiResponse } from "next";
import VideoController from "@server/api/video/video.controller";

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadAPI = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await VideoController(req, res);
};

export default uploadAPI;