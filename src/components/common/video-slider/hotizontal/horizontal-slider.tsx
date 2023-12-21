import { OrderType, SortType, Video } from "@client/utils/types";
import { screenSizes } from "@client/utils/constants";
import HorizontalSliderHeader from "./horizontal-header";
import React, { FC, useState } from "react";
import VideoDetails from "../details";
import styled from "styled-components";

const transitionTimeMS = 150;

const CarouselWrapper = styled.div`
  width: 100%;
`;

const Carousel = styled.div`
  > div {
    transition: ${(p: { hubro: HubroTypes }): number => {
      if (p.hubro === "pause") return 0;
      return transitionTimeMS * 0.001;
    }}s;

    transform: ${(p): string => {
      if (p.hubro === "forward") return "translateX(-100%)";
      if (p.hubro === "backward") return "translateX(100%)";
      return "";
    }};
  }

  position: relative;
  display: flex;
  container-type: inline-size;
  overflow-x: scroll;
`;

type HubroTypes = "pause" | "forward" | "backward";

interface HorizontalSliderProps {
  videos: Video[];
  headerText: string;
  onlyFavorites?: boolean;
  category?: string;
  search?: string;
  intialOrder?: OrderType;
  intialSort?: SortType;
}

const HorizontalSlider: FC<HorizontalSliderProps> = ({
  videos,
  headerText,
  onlyFavorites,
  category,
  search,
  intialOrder,
  intialSort,
}) => {
  const [displayedVideos, setDisplayedVideos] = useState<JSX.Element[]>([]);
  const [hubro, setHubro] = useState<HubroTypes>("pause");
  const [displayedPosition, setDisplayedPosition] = useState(0);
  const [position, setPosition] = useState(0);

  const isMaxOffset = 6 + position >= videos.length;

  if (hubro === "pause" && displayedPosition !== position) {
    setHubro(position < displayedPosition ? "backward" : "forward");

    const interval = setInterval(() => {
      setDisplayedPosition(position);
      const newDisplay = [...displayedVideos];

      if (position < displayedPosition) {
        const newVideo = videos[displayedPosition - 2];
        const newVideoEl = <VideoDetails key={newVideo?.id || "0"} video={newVideo} />;

        newDisplay.pop();
        newDisplay.unshift(newVideoEl);
      } else {
        const newVideo = videos[displayedVideos.length - 1 + displayedPosition];
        const newVideoEl = <VideoDetails key={newVideo?.id || "1"} video={newVideo} />;

        newDisplay.splice(0, 1);
        newDisplay.push(newVideoEl);
      }

      setDisplayedVideos(newDisplay);
      setHubro("pause");
      clearInterval(interval);
    }, transitionTimeMS);
  }

  return (
    <>
      <HorizontalSliderHeader
        isMaxOffset={isMaxOffset}
        displayedPosition={displayedPosition}
        position={position}
        setPosition={setPosition}
        headerText={headerText}
      />
      <CarouselWrapper>
        <Carousel hubro={hubro}>
          {videos.map((video, i) => (
            <VideoDetails
              key={i}
              video={video}
              category={category}
              onlyFavorites={onlyFavorites}
              search={search}
              sort={intialSort}
              order={intialOrder}
            />
          ))}
        </Carousel>
      </CarouselWrapper>
    </>
  );
};

export default HorizontalSlider;
