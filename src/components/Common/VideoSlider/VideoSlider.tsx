import { Video } from "@client/types/types";
import { useWindowWidth } from "@react-hook/window-size";
import HorizontalSlider from "./HorizontalSlider";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC } from "react";
import VerticleSlider from "./VerticleSlider";
import styled from "styled-components";
import theme from "@client/utils/themes";

const VideoSliderWrapper = styled.div`
  display: flex;
  padding: 15px 0px 15px 0px;
  width: auto;
  max-width: ${theme.largeScreenSize}px;
  min-width: auto;
`;

const NoVideosWrapper = styled.div`
  min-width: 100vw;
`;

interface VideoSliderProps {
  videos: Video[];
  sliderType: "verticle" | "horizontal";
}

const VideoSlider: FC<VideoSliderProps> = ({
  videos,
  sliderType,
}: VideoSliderProps) => {
  const width = useWindowWidth({
    wait: 10,
    initialWidth: theme.largeScreenSize,
  });

  let videoWidthPercent = 90;
  if (width >= theme.tabletScreenSize) videoWidthPercent = 35;
  if (width >= theme.smallScreenSize) videoWidthPercent = 25;
  if (width >= theme.mediumScreenSize) videoWidthPercent = 15;

  const videosPerRow = Math.floor(width / (width * (videoWidthPercent / 100)));

  return (
    <VideoSliderWrapper>
      {!videos.length ? (
        <NoVideosWrapper>No Videos Found</NoVideosWrapper>
      ) : (
        <NoSSR>
          {sliderType === "horizontal" ? (
            <HorizontalSlider videos={videos} videosPerRow={videosPerRow} />
          ) : (
            <VerticleSlider videos={videos} videosPerRow={videosPerRow} />
          )}
        </NoSSR>
      )}
    </VideoSliderWrapper>
  );
};

export default VideoSlider;
