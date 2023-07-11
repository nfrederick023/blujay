import { Video } from "./types";

export const updateVideo = async (video: Video): Promise<Response> => {
  const response = await fetch("/api/video", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(video),
  });
  return response;
};