import { Video } from "@client/utils/types";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import React, { FC, useState } from "react";
import VideoDetails from "./VideoDetails";
import styled from "styled-components";

const VerticleSliderWrapper = styled.div`
  width: 100%;
`;

const VideoRow = styled.div`
  display: flex;
  margin-bottom: 15px;

  & :not(:last-child) {
    margin-right: 15px;
  }
`;

interface VerticleSliderProps {
  videos: Video[];
  videosPerRow: number;
}

const VerticleSlider: FC<VerticleSliderProps> = ({
  videos,
  videosPerRow,
}: VerticleSliderProps) => {
  const [numberOfRows, setNumberOfRows] = useState(5);

  if ((numberOfRows - 1) * videosPerRow > videos.length) {
    const rows = Math.ceil(videos.length / videosPerRow);
    setNumberOfRows(rows);
  }

  if (numberOfRows * videosPerRow < videos.length && numberOfRows < 5) {
    setNumberOfRows(5);
  }

  const bottomScrollCallback = (): void => {
    if (numberOfRows * videosPerRow < videos.length) {
      setNumberOfRows(numberOfRows + 3);
    }
  };

  useBottomScrollListener(bottomScrollCallback, {});

  return (
    <VerticleSliderWrapper>
      {[...Array(numberOfRows)].map((undef, i) => (
        <VideoRow key={i}>
          {[...new Array(videosPerRow)].map((undef, j) => (
            <VideoDetails
              key={videos[i * videosPerRow + j]?.id || j}
              video={videos[i * videosPerRow + j]}
            />
          ))}
        </VideoRow>
      ))}
    </VerticleSliderWrapper>
  );
};

export default VerticleSlider;
