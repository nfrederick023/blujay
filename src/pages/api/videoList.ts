/*
 * API route for downloading videos by name
 */

import { NextApiRequest, NextApiResponse } from "next";

import { Video } from "@client/utils/types";
import { getVideoList, setVideoList } from "@server/utils/config";
import { isTokenValid } from "@server/utils/auth";

const clipList = (async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {

  const videoList = await getVideoList();

  if (!(await isTokenValid(req.cookies.authToken))) {
    res.statusCode = 401;
    res.end(JSON.stringify("Unauthorized"));
    return;
  }

  if (req.method !== "PUT") {
    res.statusCode = 405;
    res.end();
    return;
  }

  const newVideo: Video | undefined = req.body;

  if (!newVideo || !(videoList.filter(video => video.id === newVideo.id).length)) {
    res.statusCode = 404;
    res.end(JSON.stringify("No video with that ID found!"));
    return;
  }

  const properties = ["fileName", "name", "size", "saved", "created", "filePath", "thumbnailPath", "description", "requireAuth", "isFavorite", "id"];
  if (!properties.every(property => property in newVideo)) {
    res.statusCode = 400;
    res.end(JSON.stringify("Bad request"));
    return;
  }

  const body = await updateVideoList(req.body);

  if (body) {
    res.statusCode = 200;
    res.end(JSON.stringify(body));
    return;
  }

  res.statusCode = 500;
  res.end(JSON.stringify("Unable to update video list!"));
  return;
});

const updateVideoList = async (newVideo: Video): Promise<Video | null | undefined> => {
  const videoList = await getVideoList();
  // remove the old video object and add in the new one
  const updatedVideoList = videoList.filter(video => video.id !== newVideo.id);
  updatedVideoList.push(newVideo);
  await setVideoList(updatedVideoList);
  return newVideo;
};

export default clipList;