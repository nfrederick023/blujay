/* eslint-disable @typescript-eslint/no-unused-vars */
import { Video } from "@client/utils/types";
import { createContext } from "react";

type VideoContextType = {
  videos: Video[];
  updateVideo: (video: Video) => void;
};

export const VideoContext = createContext<VideoContextType>({
  videos: [],
  updateVideo: (newVideo: Video): void => {
    // updates a single video with a new video
  },
});
