/*
 * API route for downloading videos by name
 */

import { NextApiRequest, NextApiResponse } from "next";
import { Video } from "@client/utils/types";
import { checkHashedPassword } from "@server/utils/auth";
import { getThumbnailsPath, getVideoList } from "@server/utils/config";
import fs from "fs";

const useAuth = (async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {

  const getID = req.query.id as string;
  const videoId: string = getID.split(".")[0];
  const videoList = getVideoList();
  const video: Video | undefined = videoList.find((video: Video) => { return video.id === videoId; });

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end();
    return;
  }

  if (!video) {
    res.statusCode = 404;
    res.end(JSON.stringify("Could not find the video associated with this ID!"));
    return;
  }

  if (video.requireAuth && !(checkHashedPassword(req.cookies.authToken ?? ""))) {
    res.statusCode = 401;
    res.end(JSON.stringify("Unauthorized"));
    return;
  }

  if (!fs.existsSync(video.thumbnailPath)) {
    res.statusCode = 404;
    res.end(JSON.stringify("Thumbnail not found in file path!"));
    return;
  }

  res.writeHead(200, { "Content-Type": "image/webp", "Content-disposition": `attachment; filename=UTF-8 ${video.id}.webp` });
  fs.createReadStream(`${getThumbnailsPath()}${video.id}.webp`).pipe(res);

  return;
});

export default useAuth;
