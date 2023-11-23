import { Video } from "./types";

// https://stackoverflow.com/a/72930021
export const uploadVideo = async (file: File, onProgress: (progress: number) => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("progress", e => onProgress(e.loaded / e.total));
    xhr.onreadystatechange = (): void => {
      if (xhr.readyState === 4) {
        if (xhr.status === 204) {
          resolve();
        } else {
          reject(xhr.statusText);
        }
      }
    };
    xhr.addEventListener("error", (e: Event) => reject(e));
    xhr.addEventListener("abort", (e: Event) => reject(e));
    xhr.open("POST", "/api/video", true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("size", file.size.toString());
    xhr.send(formData);
  });
};

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