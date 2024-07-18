import "react-indiana-drag-scroll/dist/style.css";
import { OrderType, SortType, Video } from "@client/utils/types";
import { screenSizes } from "@client/utils/constants";
import HorizontalSliderHeader from "./horizontal-header";
import React, { FC, useEffect, useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import VideoDetails from "../details";
import styled from "styled-components";

const CarouselWrapper = styled.div`
  width: 100%;
  container-type: inline-size;
`;

const Carousel = styled(ScrollContainer)`
  div:last-child {
    margin-right: 0px;
  }
  display: flex;
  overflow: hidden;
  transition: 250ms;
  overflow-x: scroll;
`;

const CarouselOverlay = styled.div`
  position: absolute;
  display: flex;
  z-index: 1;
  height: calc(100% - 15px - 38px);
  cursor: pointer;
  pointer-events: auto;
  visibility: hidden;

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    display: none;
  }
`;

const CarouselOverlayRight = styled(CarouselOverlay)`
  width: 100%;
`;

const ChevronIcon = styled.div`
  visibility: visible;
  transition: 250ms;
  margin: auto;
  opacity: 0;
  margin-left: 10px;
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 40px;
  &:hover {
    opacity: 1;
  }
`;

const ChevronIconRight = styled(ChevronIcon)`
  margin: auto;
  margin-right: 10px;
`;

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
  const [isEnd, setIsEnd] = useState(false);
  const [isStart, setIsStart] = useState(true);
  const [scrollMax, setScrollMax] = useState(false);
  const [videosDisplayed, setVideosDisplayed] = useState(Math.min(videos.length, 36)); // 36 is arbitrary
  const draggingEl = useRef<HTMLElement>(null);

  const incrementVideo = async (): Promise<void> => {
    if (draggingEl && draggingEl.current) {
      // 15 is the missing margin on the last displayed video
      const videoWidth = (draggingEl.current.scrollWidth + 15) / videosDisplayed;
      const scrollLeft = draggingEl.current.scrollLeft;
      const nextValue = Math.ceil(scrollLeft / videoWidth) * videoWidth - scrollLeft;
      if (nextValue > 1) {
        scrollAmount(Math.ceil(nextValue));
      } else {
        scrollAmount(Math.ceil(videoWidth));
      }
    }
  };

  const decrementVideo = async (): Promise<void> => {
    if (draggingEl && draggingEl.current) {
      // 15 is the missing margin on the last displayed video
      const videoWidth = (draggingEl.current.scrollWidth + 15) / videosDisplayed;
      const scrollLeft = draggingEl.current.scrollLeft;
      const nextValue = Math.floor(scrollLeft / videoWidth) * videoWidth - scrollLeft;
      if (nextValue < -1) {
        scrollAmount(Math.floor(nextValue));
      } else {
        scrollAmount(-Math.ceil(videoWidth));
      }
    }
  };

  const resetScroll = async (): Promise<void> => {
    const amount = draggingEl.current?.scrollWidth ?? 0;
    scrollAmount(-amount);
  };

  const maxScroll = async (): Promise<void> => {
    setScrollMax(true);
    if (videosDisplayed === videos.length) {
      const amount = draggingEl.current?.scrollWidth ?? 0;
      scrollAmount(amount);
    }
    setVideosDisplayed(videos.length);
  };

  const scrollAmount = (amount: number): void => {
    draggingEl.current?.scrollBy({ left: amount, top: 0, behavior: "smooth" });
    onScroll();
  };

  const onScroll = (): void => {
    if (draggingEl && draggingEl.current) {
      const endPosition = draggingEl.current.scrollWidth - draggingEl.current.clientWidth;
      setIsStart(draggingEl.current.scrollLeft === 0);
      setIsEnd(draggingEl.current.scrollLeft === endPosition);
    }
  };

  const addMoreVideos = (): void => {
    const videosToAdd = 36;
    if (videosDisplayed + videosToAdd > videos.length) {
      setVideosDisplayed(videos.length);
    } else {
      setVideosDisplayed(videosDisplayed + 36);
    }
  };

  useEffect(() => {
    if (scrollMax) {
      setScrollMax(false);
      const amount = draggingEl.current?.scrollWidth ?? 0;
      scrollAmount(amount);
    }
  }, [videosDisplayed]);

  return (
    <>
      <HorizontalSliderHeader
        isEnd={isEnd}
        isStart={isStart}
        incrementVideo={incrementVideo}
        decrementVideo={decrementVideo}
        headerText={headerText}
      />
      <CarouselWrapper>
        <CarouselOverlay>
          <ChevronIcon className={"bx bx-chevron-left bx-md"} onClick={resetScroll} />
        </CarouselOverlay>
        <CarouselOverlayRight>
          <ChevronIconRight className={"bx bx-chevron-right bx-md"} onClick={maxScroll} />
        </CarouselOverlayRight>
        <Carousel
          ref={draggingEl as React.ReactPortal & React.MutableRefObject<unknown>}
          onEndScroll={addMoreVideos}
          onScroll={onScroll}
        >
          {videos.slice(0, videosDisplayed).map((video, i) => (
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
