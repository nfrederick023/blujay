import { Video } from "./types";

// https://stackoverflow.com/a/72930021
export const uploadVideo = async (file: File, onProgress: (progress: number) => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", e => onProgress(e.loaded / e.total));
    xhr.onreadystatechange = (): void => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 204) {
          resolve();
        } else {
          if (xhr.response) {
            try {
              reject(JSON.parse(xhr.response).message);
            } catch (e) {
              reject(xhr.response);
            }
          }

          // chrome returns no reponse on abort for whatever reasion, the most likely reason for abort is
          // becuase file already exists, so suggest that. Otherwise, on firefox it works as expected
          reject("Failed to Upload File: Does file already exist?");
        }
      }
    };
    xhr.addEventListener("error", (e: Event) => reject(e));
    xhr.addEventListener("abort", (e: Event) => reject(e));
    xhr.open("POST", "/api/upload", true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("size", file.size.toString());
    xhr.send(formData);
  });
};

export const renameFileAPI = async (id: string, newName: string): Promise<Response> => {
  const response = await fetch("/api/video", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, newName }),
  });
  return response;
};


export const updateVideoAPI = async (video: Video): Promise<Response> => {
  const response = await fetch("/api/video", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(video),
  });
  return response;
};

export const deleteVideoAPI = async (id: string): Promise<Response> => {
  const response = await fetch("/api/video", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
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