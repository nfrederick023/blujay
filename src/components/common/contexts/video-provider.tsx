import { Video } from "@client/utils/types";
import { VideoContext } from "./video-context";
import React, { FC, ReactNode, useState } from "react";
export interface VideoProviderProps {
  children: ReactNode;
}

const VideoProvider: FC<VideoProviderProps> = ({ children }: VideoProviderProps) => {
  const [videos, _setVideos] = useState<Video[]>([]);
  const [touched, setTouched] = useState(false);

  const setVideos = (newVideos: Video[]): void => {
    if (!touched) {
      setTouched(true);
      _setVideos(newVideos);
    } else {
      _setVideos(newVideos);
    }
  };

  const updateVideo = (newVideo: Video): void => {
    setVideos([...videos.filter((video) => video.id !== newVideo.id), newVideo]);
  };

  return <VideoContext.Provider value={{ touched, videos, setVideos, updateVideo }}>{children}</VideoContext.Provider>;
};

export default VideoProvider;
