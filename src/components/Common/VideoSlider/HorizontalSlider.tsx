import { Video } from "@client/utils/types";
import React, { FC } from "react";
import VideoDetails from "./VideoDetails";

interface HorizontalSliderProps {
  videos: Video[];
  videosPerRow: number;
}

const HorizontalSlider: FC<HorizontalSliderProps> = ({
  videos,
  videosPerRow,
}: HorizontalSliderProps) => {
  return (
    <>
      {[...new Array(videosPerRow)].map((undef, i) => (
        <VideoDetails key={i} video={videos[i]} />
      ))}
    </>
  );
};

export default HorizontalSlider;
