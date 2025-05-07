import { Video } from "@client/utils/types";
import { deleteVideoAPI, updateVideoAPI } from "@client/utils/api";
import React, { FC, ReactNode, createContext, useState } from "react";

type VideoContextType = {
  videos: Video[];
  updateVideo: (video: Video) => Promise<boolean>;
  deleteVideo: (video: Video) => Promise<boolean>;
};

// I don't care that this isn't typed correctly, if VideoContext is undefined at any point you messed up
export const VideoContext = createContext<VideoContextType>(undefined as unknown as VideoContextType);

export interface VideoProviderProps {
  children: ReactNode;
  intialVideos: Video[];
}

export const VideoProvider: FC<VideoProviderProps> = ({ children, intialVideos }) => {
  const [videos, setVideos] = useState<Video[]>(intialVideos);

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

  return <VideoContext.Provider value={{ videos, updateVideo, deleteVideo }}>{children}</VideoContext.Provider>;
};
