/*
 * API route for downloading videos by name
 */

import * as mime from "mime-types";
import { NextApiRequest, NextApiResponse } from "next";
import { Video } from "@client/utils/types";
import { checkHashedPassword } from "@server/utils/auth";
import { getThumbnailsPath, getVideoList } from "@server/utils/config";
import { isMediaTypeVideo } from "@client/utils/checkMediaType";
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

  if (isMediaTypeVideo(video.extentsion) || video.extentsion === "gif") {
    res.writeHead(200, { "Content-Type": "image/jpeg", "Content-disposition": `attachment; filename=${video.name}.jpeg` });
    fs.createReadStream(`${getThumbnailsPath()}${video.id}.jpg`).pipe(res);
  } else {
    const mimeType = mime.lookup(video.fileName) || "";
    res.writeHead(200, { "Content-Type": mimeType, "Content-disposition": `attachment; filename=${video.fileName}` });
    fs.createReadStream(video.filePath).pipe(res);
  }
  return;
});

export default useAuth;
