import { NextApiRequest, NextApiResponse } from "next";
import VideoController from "@server/api/video/video.controller";

export const config = {
  api: {
    bodyParser: false,
  },
};

const videoListAPI = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  // we need to disable bodyparser for upload API, but still need to parse for other routes so manually body parse here
  if (req.method === "PUT" && req.headers["content-type"] === "application/json") {
    const readable = req.read();
    const buffer = Buffer.from(readable);
    req.body = JSON.parse(buffer.toString());
    await VideoController(req, res);
  }

  await VideoController(req, res);
};

export default videoListAPI;
