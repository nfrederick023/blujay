import { Video } from "@client/utils/types";
import { VideoContext } from "./video-context";
import { updateVideoAPI } from "@client/utils/api";
import React, { FC, ReactNode, useState } from "react";
export interface VideoProviderProps {
  children: ReactNode;
  intialVideos: Video[];
}

const VideoProvider: FC<VideoProviderProps> = ({ children, intialVideos }) => {
  const [videos, setVideos] = useState<Video[]>(intialVideos);

  const updateVideo = async (newVideo: Video): Promise<void> => {
    const res = await updateVideoAPI(newVideo);
    if (res.ok) {
      const listClone = [...videos];
      const videoIndexToUpdate = videos.findIndex((video) => video.id === newVideo.id);
      if (videoIndexToUpdate !== 1) {
        const updatedVideo: Video = { ...videos[videoIndexToUpdate], ...updateVideo };
        listClone[videoIndexToUpdate] = updatedVideo;
        setVideos([...videos.filter((video) => video.id !== newVideo.id), newVideo]);
      }
    }
  };

  return <VideoContext.Provider value={{ videos, updateVideo }}>{children}</VideoContext.Provider>;
};

export default VideoProvider;
