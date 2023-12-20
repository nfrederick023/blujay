import { Video } from "@client/utils/types";
import { VideoContext } from "./video-context";
import React, { FC, ReactNode, useState } from "react";
export interface VideoProviderProps {
  children: ReactNode;
  intialVideos: Video[];
}

const VideoProvider: FC<VideoProviderProps> = ({ children, intialVideos }) => {
  const [videos, _setVideos] = useState<Video[]>(intialVideos);
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
    const listClone = [...videos];
    const videoIndexToUpdate = videos.findIndex((video) => video.id === newVideo.id);
    if (videoIndexToUpdate !== 1) {
      const updatedVideo: Video = { ...videos[videoIndexToUpdate], ...updateVideo };
      listClone[videoIndexToUpdate] = updatedVideo;
      setVideos([...videos.filter((video) => video.id !== newVideo.id), newVideo]);
    }
  };

  return <VideoContext.Provider value={{ touched, videos, setVideos, updateVideo }}>{children}</VideoContext.Provider>;
};

export default VideoProvider;
