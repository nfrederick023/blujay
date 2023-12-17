/* eslint-disable @typescript-eslint/no-unused-vars */
import { Video } from "@client/utils/types";
import { createContext } from "react";

type VideoContextType = {
  videos: Video[];
  touched: boolean;
  setVideos: (newVideos: Video[]) => void;
  updateVideo: (video: Video) => void;
};

export const VideoContext = createContext<VideoContextType>({
  videos: [],
  touched: false,
  setVideos: (): void => {
    // sets the entire video list
  },
  updateVideo: (newVideo: Video): void => {
    // updates a single video with a new video
  },
});
