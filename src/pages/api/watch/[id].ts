/*
 * API route for downloading videos by name
 */

import * as mime from "mime-types";

import { NextApiRequest, NextApiResponse } from "next";
import { NodeHeaders } from "next/dist/server/web/types";

import { Video } from "@client/utils/types";
import { getVideoList } from "@server/utils/config";
import { isTokenValid } from "@server/utils/auth";
import fs from "fs";

const getVideoByID = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {

  const getID = req.query.id as string;
  const videoId: string = getID.split(".")[0];
  const videoList = await getVideoList();
  const video: Video | undefined = videoList.find((video: Video) => { return video.id === videoId; });

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end();
    return;
  }

  if (video) {

    if (video.requireAuth && !(await isTokenValid(req.cookies.authToken))) {
      res.statusCode = 401;
      res.end(JSON.stringify("Unauthorized"));
      return;
    }

    if (!fs.existsSync(video.filePath)) {
      res.statusCode = 404;
      res.end(JSON.stringify("Video not found in file path!"));
      return;
    }

    serveVideo(req, res, video.filePath);
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify("Could not locate video!"));
  return;
};

/*
 * Serves a video using chunks
 *
 * Source: https://betterprogramming.pub/video-stream-with-node-js-and-html5-320b3191a6b6
 */
const serveVideo = (req: NextApiRequest, res: NextApiResponse, videoPath: string): void => {
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head: NodeHeaders = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize.toString(),
      "Content-Type": mime.lookup(videoPath) ? mime.lookup(videoPath).toString() : undefined,
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head: NodeHeaders = {
      "Content-Length": fileSize.toString(),
      "Content-Type": mime.lookup(videoPath) ? mime.lookup(videoPath).toString() : undefined,
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
};

export default getVideoByID;