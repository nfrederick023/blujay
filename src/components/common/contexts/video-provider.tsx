import { Video } from "@client/utils/types";
import { VideoContext } from "./video-context";
import React, { FC, ReactNode, useState } from "react";

export interface VideoProviderProps {
  children: ReactNode;
}

const VideoProvider: FC<VideoProviderProps> = ({ children }: VideoProviderProps) => {
  const [videos, setVideos] = useState<Video[]>([]);

  const updateVideo = (newVideo: Video): void => {
    setVideos([...videos.filter((video) => video.id !== newVideo.id), newVideo]);
  };

  return <VideoContext.Provider value={{ videos, setVideos, updateVideo }}>{children}</VideoContext.Provider>;
};

export default VideoProvider;
