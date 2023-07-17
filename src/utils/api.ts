import { Video } from "./types";

export const updateVideo = async (video: Video): Promise<Response> => {
  const response = await fetch("/api/video", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(video),
  });
  return response;
};

export const login = async (password: string): Promise<Response> => {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return response;
};