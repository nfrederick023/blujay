import { Video } from "@client/utils/types";
import React, { FC } from "react";
import VideoDetails from "./VideoDetails";

interface HorizontalSliderProps {
  videos: Video[];
  videosPerRow: number;
  offset: number;
}

const HorizontalSlider: FC<HorizontalSliderProps> = ({
  videos,
  videosPerRow,
  offset,
}: HorizontalSliderProps) => {
  return (
    <>
      {[...new Array(videosPerRow)].map((undef, i) => (
        <VideoDetails key={i} video={videos[i + offset]} />
      ))}
    </>
  );
};

export default HorizontalSlider;
