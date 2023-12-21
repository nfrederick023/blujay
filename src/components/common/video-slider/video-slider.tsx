import { OrderType, SliderType, SortType, Video } from "@client/utils/types";
import { sortVideos } from "@client/utils/sortVideo";
import HorizontalSlider from "./hotizontal/horizontal-slider";
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
  onlyFavorites?: boolean;
  category?: string;
  search?: string;
  headerText: string;
  videos: Video[];
}

const VideoSlider: FC<VideoSliderProps> = ({
  intialOrder,
  intialSort,
  onlyFavorites,
  category,
  search,
  sliderType,
  headerText,
  videos,
}) => {
  const sort: SortType = intialSort || "Alphabetical";
  const order: OrderType = intialOrder || "Ascending";

  let sortedVideos = [...videos];
  if (intialSort || intialOrder) {
    sortedVideos = sortVideos(sortedVideos, sort, order);
  }

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
          {sliderType === "horizontal" ? (
            <HorizontalSlider
              videos={sortedVideos}
              headerText={headerText}
              category={category}
              onlyFavorites={onlyFavorites}
              search={search}
              intialOrder={order}
              intialSort={sort}
            />
          ) : (
            <VerticleSlider
              videos={sortedVideos}
              intialOrder={order}
              intialSort={sort}
              headerText={headerText}
              category={category}
              onlyFavorites={onlyFavorites}
              search={search}
            />
          )}
        </VideoSliderWrapper>
      )}
    </>
  );
};

export default VideoSlider;
