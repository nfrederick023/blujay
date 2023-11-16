import { Video } from "@client/utils/types";
import { createContext } from "react";

type VideoContextType = {
  videos: Video[];
  setVideos: (newVideos: Video[]) => void;
  updateVideo: (video: Video) => void;
};

export const VideoContext = createContext<VideoContextType>({
  videos: [],
  setVideos: (): void => {
    //
  },
  updateVideo: (): void => {
    //
  },
});
