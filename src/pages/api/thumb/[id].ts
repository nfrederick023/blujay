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
    res.writeHead(200, { "Content-Type": "image/webp", "Content-disposition": "filename=thumbnail_placeholder.png" });
    fs.createReadStream("./public/images/thumbnail_placeholder.png").pipe(res);
    return;
  }

  if (video.requireAuth && !(checkHashedPassword(req.cookies.authToken ?? ""))) {
    res.statusCode = 401;
    res.end(JSON.stringify("Unauthorized"));
    return;
  }

  if (!fs.existsSync(video.thumbnailFilepath)) {
    res.writeHead(200, { "Content-Type": "image/webp", "Content-disposition": "filename=thumbnail_placeholder.png" });
    fs.createReadStream("./public/images/thumbnail_placeholder.png").pipe(res);
    return;
  }

  res.writeHead(200, { "Content-Type": "image/webp", "Content-disposition": `filename=${video.id}.webp` });
  fs.createReadStream(`${getThumbnailsPath()}${video.id}.webp`).pipe(res);

  return;
});

export default useAuth;
