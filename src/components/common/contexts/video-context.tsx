import { Video } from "@client/utils/types";
import { deleteVideoAPI, renameFileAPI, updateVideoAPI } from "@client/utils/api";
import React, { FC, ReactNode, createContext, useState } from "react";

type VideoContextType = {
  videos: Video[];
  updateVideo: (video: Video) => Promise<boolean>;
  deleteVideo: (video: Video) => Promise<boolean>;
  renameFile: (videoToRename: Video, newName: string) => Promise<Video | undefined>;
};

// I don't care that this isn't typed correctly, if VideoContext is undefined at any point you messed up
export const VideoContext = createContext<VideoContextType>(undefined as unknown as VideoContextType);

export interface VideoProviderProps {
  children: ReactNode;
  intialVideos: Video[];
}

export const VideoProvider: FC<VideoProviderProps> = ({ children, intialVideos }) => {
  const [videos, setVideos] = useState<Video[]>(intialVideos);

  const renameFile = async (videoToRename: Video, newName: string): Promise<Video | undefined> => {
    const res = await renameFileAPI(videoToRename.id, newName);
    if (res.ok) {
      const newVideo = await res.json();
      setVideos([...videos.filter((video) => video.id !== videoToRename.id), newVideo]);
      return newVideo;
    }
  };

  const updateVideo = async (newVideo: Video): Promise<boolean> => {
    const res = await updateVideoAPI(newVideo);
    if (res.ok) {
      setVideos([...videos.filter((video) => video.id !== newVideo.id), newVideo]);
    }
    return res.ok;
  };

  const deleteVideo = async (videoToDelete: Video): Promise<boolean> => {
    const res = await deleteVideoAPI(videoToDelete.id);
    if (res.ok) {
      setVideos(videos.filter((video) => video.id !== videoToDelete.id));
    }
    return res.ok;
  };

  return (
    <VideoContext.Provider value={{ videos, updateVideo, deleteVideo, renameFile }}>{children}</VideoContext.Provider>
  );
};
