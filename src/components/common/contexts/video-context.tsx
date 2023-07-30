import { Video } from "@client/utils/types";
import { createContext } from "react";

type VideoContextType = { videos: Video[]; setVideos: (videos: Video[]) => void };

export const VideoContext = createContext<VideoContextType>({ videos: [], setVideos: (videos: Video[]) => {} });
