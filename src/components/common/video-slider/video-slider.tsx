import { OrderType, SliderType, SortType, Video } from "@client/utils/types";
import { screenSizes } from "@client/utils/constants";
import { sortVideos } from "@client/utils/sortVideo";
import { useWindowWidth } from "@react-hook/window-size";
import HorizontalSlider from "./hotizontal/horizontal-slider";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC } from "react";
import SliderHeader from "./header";
import VerticleSlider from "./verticle/verticle-slider";
import styled from "styled-components";

const VideoSliderWrapper = styled.div`
  padding: 0px 0px 15px 0px;
  width: auto;
  min-width: auto;
`;

interface VideoSliderProps {
  intialOrder?: OrderType;
  sliderType: SliderType;
  intialSort?: SortType;
  headerText: string;
  videos: Video[];
}

const VideoSlider: FC<VideoSliderProps> = ({
  intialOrder,
  intialSort,
  sliderType,
  headerText,
  videos,
}: VideoSliderProps) => {
  const width = useWindowWidth({ wait: 10 });
  const scrollbarWidth = 20;

  let videoWidthPercent = 90;
  // we add the scroll bar here so that that 1080p devices don't switch from 6 to 4 videos per row when scroll bar pops in
  if (width + scrollbarWidth >= screenSizes.tabletScreenSize) videoWidthPercent = 35;
  if (width + scrollbarWidth >= screenSizes.smallScreenSize) videoWidthPercent = 25;
  if (width + scrollbarWidth >= screenSizes.mediumScreenSize) videoWidthPercent = 15;

  const videosPerRow = Math.floor(width / (width * (videoWidthPercent / 100)));

  let sortedVideos = [...videos];
  if (intialSort || intialOrder)
    sortedVideos = sortVideos(sortedVideos, intialSort || "Alphabetical", intialOrder || "Ascending");

  return (
    <>
      {!videos.length ? (
        <>
          <SliderHeader headerText={headerText} sliderType="horizontal">
            <></>
          </SliderHeader>
          <VideoSliderWrapper>No Videos Found</VideoSliderWrapper>
        </>
      ) : (
        <VideoSliderWrapper>
          <NoSSR>
            {sliderType === "horizontal" ? (
              <HorizontalSlider videos={sortedVideos} videosPerRow={videosPerRow} headerText={headerText} />
            ) : (
              <VerticleSlider
                videos={sortedVideos}
                intialOrder={intialOrder}
                intialSort={intialSort}
                videosPerRow={videosPerRow}
                headerText={headerText}
              />
            )}
          </NoSSR>
        </VideoSliderWrapper>
      )}
    </>
  );
};

export default VideoSlider;
