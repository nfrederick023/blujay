import { OrderType, SortType, Video } from "@client/utils/types";
import { screenSizes } from "@client/utils/theme";
import { sortVideos } from "@client/utils/sortVideo";
import { useWindowWidth } from "@react-hook/window-size";
import HorizontalSlider from "./hotizontal/horizontal-slider";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC } from "react";
import SliderHeader from "./header";
import VerticleSlider from "./verticle/verticle-slider";
import styled from "styled-components";

const VideoSliderWrapper = styled.div`
  padding: 15px 0px 15px 0px;
  width: auto;
  max-width: ${screenSizes.largeScreenSize}px;
  min-width: auto;
`;

const NoVideosWrapper = styled.div`
  min-width: 100vw;
`;

type SliderType = "verticle" | "horizontal";

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
  const width = useWindowWidth({
    wait: 10,
    initialWidth: screenSizes.largeScreenSize,
  });

  let videoWidthPercent = 90;
  if (width >= screenSizes.tabletScreenSize) videoWidthPercent = 35;
  if (width >= screenSizes.smallScreenSize) videoWidthPercent = 25;
  if (width >= screenSizes.mediumScreenSize) videoWidthPercent = 15;

  const videosPerRow = Math.floor(width / (width * (videoWidthPercent / 100)));

  let sortedVideos = [...videos];
  if (intialSort || intialOrder)
    sortedVideos = sortVideos(
      sortedVideos,
      intialSort || "Alphabetical",
      intialOrder || "Ascending"
    );

  return (
    <>
      {!videos.length ? (
        <>
          <SliderHeader headerText={headerText}>
            <></>
          </SliderHeader>
          <NoVideosWrapper>No Videos Found</NoVideosWrapper>
        </>
      ) : (
        <VideoSliderWrapper>
          {" "}
          <NoSSR>
            {sliderType === "horizontal" ? (
              <HorizontalSlider
                videos={sortedVideos}
                videosPerRow={videosPerRow}
                headerText={headerText}
              />
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
