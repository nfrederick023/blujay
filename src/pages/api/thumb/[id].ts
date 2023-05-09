/*
 * API route for downloading videos by name
 */

import { NextApiRequest, NextApiResponse } from "next";
import { Video } from "@client/utils/types";
import { getThumbnailsPath, getVideoList } from "@server/utils/config";
import { isTokenValid } from "@server/utils/auth";
import fs from "fs";

const useAuth = (async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {

  const videoId = req.query.id;

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

  if (video.requireAuth && !(isTokenValid(req.cookies.authToken))) {
    res.statusCode = 401;
    res.end(JSON.stringify("Unauthorized"));
    return;
  }

  if (!fs.existsSync(video.thumbnailPath)) {
    res.statusCode = 404;
    res.end(JSON.stringify("Thumbnail not found in file path!"));
    return;
  }

  res.writeHead(200, { "Content-Type": "image/jpeg", "Content-disposition": `attachment; filename=${video.name}.jpeg` });
  fs.createReadStream(`${getThumbnailsPath()}${video.name}.jpg`).pipe(res);
  return;


});

export default useAuth;
