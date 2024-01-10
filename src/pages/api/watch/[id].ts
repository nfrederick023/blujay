/*
 * API route for downloading videos by name
 */
import * as mime from "mime-types";
import { NextApiRequest, NextApiResponse } from "next";
import { Video } from "@client/utils/types";
import { booleanify } from "@client/utils/cookie";
import { checkHashedPassword } from "@server/utils/auth";
import { getVideoList } from "@server/utils/config";
import { updateVideo } from "@server/api/video/video.service";
import fs from "fs";

const getVideoByID = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {

  const getID = req.query.id as string;
  const isPreview = booleanify(req.query.isPreview as string);
  const videoId: string = getID.split(".")[0];
  const videoList = getVideoList();
  const video: Video | undefined = videoList.find((video: Video) => { return video.id === videoId; });

  if (req.method !== "GET") {
    res.statusCode = 405;
    res.end();
    return;
  }

  if (video) {

    if (video.requireAuth && !(checkHashedPassword(req.cookies.authToken ?? ""))) {
      res.statusCode = 401;
      res.end(JSON.stringify("Unauthorized"));
      return;
    }

    if (!fs.existsSync(video.filePath)) {
      res.statusCode = 404;
      res.end(JSON.stringify("Video not found in file path!"));
      return;
    }

    if (video.type === "video") {
      serveVideo(req, res, video);

      // count as a view if it's not a preview and if you're at the start of the video
      if (!isPreview && req.headers.range && Number(req.headers.range.replace(/\D/g, "")) === 0) {
        updateVideo({ id: video.id, views: video.views + 1 });
      }
    } else {
      const mimeType = mime.lookup(video.extentsion) || "";
      // "Content-disposition": `attachment; filename=${video.fileName}`
      res.writeHead(200, { "Content-Type": mimeType });
      fs.createReadStream(video.filePath).pipe(res);

      // count as a view if it's not a preview
      if (!isPreview) {
        updateVideo({ id: video.id, views: video.views + 1 });
      }
    }
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify("Could not locate video!"));
  return;
};

const serveVideo = (req: NextApiRequest, res: NextApiResponse, video: Video): void => {
  const range = req.headers.range ?? "0";
  const videoSize = video.size;
  const chunkSize = 1 * 4e6; // 4mbs
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + chunkSize, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": video.mimeType
  };
  res.writeHead(206, headers);
  const stream = fs.createReadStream(video.filePath, {
    start,
    end
  });
  stream.pipe(res);
};

export default getVideoByID;