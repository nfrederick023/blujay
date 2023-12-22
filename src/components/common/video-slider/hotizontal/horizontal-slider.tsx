import "react-indiana-drag-scroll/dist/style.css";
import { OrderType, SortType, Video } from "@client/utils/types";
import { useRouter } from "next/router";
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
  const [isScrolling, setIsScrolling] = useState(false);
  const [videosDisplayed, setVideosDisplayed] = useState(36); // 36 is arbitrary
  const [scroll, setScroll] = useState(0);
  const draggingEl = useRef<HTMLElement>(null);

  const router = useRouter();

  if (!draggingEl.current?.scrollWidth) {
    draggingEl.current?.scrollTo(scroll, 0);
  }

  const incrementVideo = async (): Promise<void> => {
    if (draggingEl && draggingEl.current) {
      // 15 is the missing margin on the last displayed video
      const videoWidth = (draggingEl.current.scrollWidth + 15) / videosDisplayed;
      await gracefullyScroll(40, draggingEl.current.scrollLeft + videoWidth);
    }
  };

  const decrementVideo = async (): Promise<void> => {
    if (draggingEl && draggingEl.current) {
      // 15 is the missing margin on the last displayed video
      const videoWidth = (draggingEl.current.scrollWidth + 15) / videosDisplayed;
      await gracefullyScroll(-40, draggingEl.current.scrollLeft - videoWidth);
    }
  };

  const resetScroll = async (): Promise<void> => {
    if (draggingEl && draggingEl.current) {
      await gracefullyScroll(-160, 0);
    }
  };

  const maxScroll = async (): Promise<void> => {
    setVideosDisplayed(videos.length);
    if (draggingEl && draggingEl.current) {
      await gracefullyScroll(160, draggingEl.current.scrollWidth - draggingEl.current.clientWidth);
    }
  };

  const gracefullyScroll = async (speed: number, endPosition: number): Promise<void> => {
    if (draggingEl && draggingEl.current && !isScrolling) {
      setIsScrolling(true);
      while (draggingEl.current.scrollLeft !== endPosition) {
        // validate end position
        if (endPosition < 0) {
          draggingEl.current.scrollTo(0, 0);
          break;
        }

        // validate end position
        if (endPosition > draggingEl.current.scrollWidth - draggingEl.current.clientWidth) {
          draggingEl.current.scrollTo(draggingEl.current.scrollWidth - draggingEl.current.clientWidth, 0);
          break;
        }

        // are we increasing or decreasing?
        if (draggingEl.current.scrollLeft < endPosition) {
          // if increasing, is the next value greater than the end position?
          if (draggingEl.current.scrollLeft + speed > endPosition) {
            draggingEl.current.scrollTo(endPosition, 0);
            break;
          }
        } else {
          // if decreasing, is the next value less than the end position?
          if (draggingEl.current.scrollLeft + speed < endPosition) {
            draggingEl.current.scrollTo(endPosition, 0);
            break;
          }
        }

        draggingEl.current.scrollTo(draggingEl.current.scrollLeft + speed, 0);

        await new Promise((res) => {
          setTimeout(() => {
            res("");
          }, 1);
        });
      }
      setIsScrolling(false);
      onScroll();
    }
  };

  const onScroll = (): void => {
    if (draggingEl && draggingEl.current) {
      if (!isStart && draggingEl.current.scrollLeft === 0) {
        setIsStart(true);
      }
      if (isStart && draggingEl.current.scrollLeft !== 0) {
        setIsStart(false);
      }
      const endPosition = draggingEl.current.scrollWidth - draggingEl.current.clientWidth;
      if (!isEnd && draggingEl.current.scrollLeft === endPosition) {
        setIsEnd(true);
      }
      if (isEnd && draggingEl.current.scrollLeft !== endPosition) {
        setIsEnd(false);
      }
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
    const updateScroll = (): void => {
      if (draggingEl && draggingEl.current) {
        setScroll(draggingEl.current.scrollLeft);
      }
    };
    router.events.on("routeChangeStart", updateScroll);

    return () => {
      router.events.off("routeChangeStart", updateScroll);
    };
  }, []);

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
