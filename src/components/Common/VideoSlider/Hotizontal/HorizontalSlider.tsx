"use client";
import { Video } from "@client/utils/types";
import React, { FC, useState } from "react";
import VideoDetails from "../VideoDetails";
import styled from "styled-components";

const transitionTimeMS = 150;

const CarouselWrapper = styled.div`
  overflow: clip;
  width: 100%;
`;

const Carousel = styled.div`
  > div {
    transition: ${(p: { videoWidth: number; hubro: HubroTypes }): number => {
      if (p.hubro === "pause") return 0;
      return transitionTimeMS * 0.001;
    }}s;

    transform: ${(p): string => {
      if (p.hubro === "forward") return "translateX(-100%)";
      if (p.hubro === "backward") return "translateX(100%)";
      return "";
    }};
  }

  & :not(:last-child) {
    margin-right: 15px;
  }
  width: ${(p): number => 100 + p.videoWidth * 2}%;
  left: -${(p): number => p.videoWidth}%;

  position: relative;

  display: flex;
`;

type HubroTypes = "pause" | "forward" | "backward";

interface HorizontalSliderProps {
  videos: Video[];
  videosPerRow: number;
  position: number;
  displayedPosition: number;
  setDisplayedPosition: React.Dispatch<React.SetStateAction<number>>;
}

const HorizontalSlider: FC<HorizontalSliderProps> = ({
  videos,
  position,
  videosPerRow,
  displayedPosition,
  setDisplayedPosition,
}: HorizontalSliderProps) => {
  const [displayedVideos, setDisplayedVideos] = useState<JSX.Element[]>([]);
  const [hubro, setHubro] = useState<HubroTypes>("pause");
  const videoWidth = 100 / videosPerRow;

  if (hubro === "pause" && displayedPosition !== position) {
    setHubro(position < displayedPosition ? "backward" : "forward");

    const interval = setInterval(() => {
      setDisplayedPosition(position);
      const newDisplay = [...displayedVideos];

      if (position < displayedPosition) {
        const newVideo = videos[displayedPosition - 2];
        const newVideoEl = (
          <VideoDetails key={newVideo?.id || "0"} video={newVideo} />
        );

        newDisplay.pop();
        newDisplay.unshift(newVideoEl);
      } else {
        const newVideo = videos[displayedVideos.length - 1 + displayedPosition];
        const newVideoEl = (
          <VideoDetails key={newVideo?.id || "1"} video={newVideo} />
        );

        newDisplay.splice(0, 1);
        newDisplay.push(newVideoEl);
      }

      setDisplayedVideos(newDisplay);
      setHubro("pause");
      clearInterval(interval);
    }, transitionTimeMS);
  }

  if (videosPerRow + 2 !== displayedVideos.length) {
    setDisplayedVideos(
      [...new Array(videosPerRow + 2)].map((undef, i) => (
        <VideoDetails
          key={videos[i + displayedPosition - 1]?.id || i}
          video={videos[i + displayedPosition - 1]}
        />
      ))
    );
  }
  return (
    <CarouselWrapper>
      <Carousel videoWidth={videoWidth} hubro={hubro}>
        {displayedVideos}
      </Carousel>
    </CarouselWrapper>
  );
};

export default HorizontalSlider;
