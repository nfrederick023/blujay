import { Video } from "@client/utils/types";
import React, { FC } from "react";
import VideoDetails from "./VideoDetails";
import styled from "styled-components";

const VideoRow = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

interface VerticleSliderProps {
  videos: Video[];
  videosPerRow: number;
}

const VerticleSlider: FC<VerticleSliderProps> = ({
  videos,
  videosPerRow,
}: VerticleSliderProps) => {
  const numberOfRows = Math.ceil(videos.length / videosPerRow);

  return (
    <div>
      {[...Array(numberOfRows)].map((undef, i) => (
        <VideoRow key={i}>
          {[...new Array(videosPerRow)].map((undef, j) => (
            <VideoDetails key={j} video={videos[i * videosPerRow + j]} />
          ))}
        </VideoRow>
      ))}
    </div>
  );
};

export default VerticleSlider;
