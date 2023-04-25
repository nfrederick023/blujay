"use client";

import {
  BluJayTheme,
  OrderType,
  QueryField,
  SortType,
  Video,
} from "@client/utils/types";
import { screenSizes } from "@client/utils/theme";
import { sortVideos } from "@client/utils/sortVideo";
import { useWindowWidth } from "@react-hook/window-size";
import Gradient from "../Styled/Gradient";
import HorizontalSlider from "./Hotizontal/HorizontalSlider";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC, useEffect, useState } from "react";
import Select from "../Select/Select";
import VerticleSlider from "./Verticle/VerticleSlider";
import styled from "styled-components";

const VideoSliderWrapper = styled.div`
  display: flex;
  padding: 15px 0px 15px 0px;
  width: auto;
  max-width: ${screenSizes.largeScreenSize}px;
  min-width: auto;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
`;

const HeaderIconsWrapper = styled.div`
  margin-left: auto;
  display: flex;
`;

const SortSelect = styled.div`
  display: flex;
  width: 260px;
`;

const TypeSelect = styled.div`
  width: 130px;
  margin-left: 10px;
  display: flex;
`;

const NoVideosWrapper = styled.div`
  min-width: 100vw;
`;
const SortIcon = styled.i`
  color: ${(p): string => p.theme.textContrast};
  font-size: 1.25rem;
  vertical-align: baseline;
  margin-left: auto;
  margin-right: 5px;

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }
`;

const ChevronIcon = styled(SortIcon)`
  opacity: ${(p: { isEnabled: boolean; theme: BluJayTheme }): number =>
    p.isEnabled ? 1 : 0.5};

  &:hover {
    color: ${(p): string =>
      p.isEnabled ? p.theme.text : p.theme.textContrast};
    cursor: ${(p): string => (p.isEnabled ? "pointer" : "auto")};
  }
`;

type SliderType = "verticle" | "horizontal";
type ViewTypes = "List View" | "Grid View";

interface VideoSliderProps {
  sort?: SortType;
  order?: OrderType;
  sliderType: SliderType;
  header: string;
}

interface GetVideosRequest {
  page: number;
  size: number;
  sort: SortType;
  order: OrderType;
  query: string;
  queryField: QueryField[];
}

const VideoSlider: FC<VideoSliderProps> = ({
  sort,
  order,
  sliderType,
  header,
}: VideoSliderProps) => {
  const [sortType, setSortType] = useState<SortType>(sort || "Alphabetical");
  const [orderType, setOrderType] = useState<OrderType>(order || "Ascending");
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [displayedPosition, setDisplayedPosition] = useState(0);
  const [position, setPosition] = useState(0);

  const getVideos = async (): Promise<void> => {
    if (typeof window !== "undefined") {
      const res = await fetch("/api/videoList", {
        headers: { "Content-Type": "application/json" },
        method: "GET",
      });
      setVideos(await res.json());
    }
  };

  const handleSortChange = (newSort: string): void => {
    setSortType(newSort as SortType);
  };

  const handleIsAscendingChange = (): void => {
    if (orderType === "Ascending") setOrderType("Descending");
    else setOrderType("Ascending");
  };

  const handleViewChange = (): void => {
    setIsGridView(!isGridView);
  };

  const handleIncrementOffset = (): void => {
    if (!isMaxOffset && displayedPosition === position)
      setPosition(position + 1);
  };

  const handleDecrementOffset = (): void => {
    if (position && displayedPosition === position) setPosition(position - 1);
  };

  const viewTypes: ViewTypes[] = ["Grid View", "List View"];
  const sortOptions: SortType[] = [
    "Alphabetical",
    "Date Created",
    "Date Updated",
    "File Size",
    "View Count",
  ];

  const width = useWindowWidth({
    wait: 10,
    initialWidth: screenSizes.largeScreenSize,
  });

  let videoWidthPercent = 90;
  if (width >= screenSizes.tabletScreenSize) videoWidthPercent = 35;
  if (width >= screenSizes.smallScreenSize) videoWidthPercent = 25;
  if (width >= screenSizes.mediumScreenSize) videoWidthPercent = 15;

  const videosPerRow = Math.floor(width / (width * (videoWidthPercent / 100)));
  const listValue = isGridView ? "Grid View" : "List View";

  const isMaxOffset = videosPerRow + position >= videos.length;

  const sortedVideos: Video[] = sortVideos([...videos], sortType, orderType);

  useEffect(() => {
    getVideos();
  }, []);

  return (
    <>
      <Header>
        <Gradient type="text">
          <h2>{header}</h2>
        </Gradient>
        <HeaderIconsWrapper>
          {sliderType === "horizontal" ? (
            <NoSSR>
              <ChevronIcon
                className={"bx bx-chevron-left"}
                isEnabled={!!position}
                onClick={handleDecrementOffset}
              />
              <ChevronIcon
                className={"bx bx-chevron-right"}
                isEnabled={!isMaxOffset}
                onClick={handleIncrementOffset}
              />
            </NoSSR>
          ) : (
            <>
              <SortSelect>
                <SortIcon
                  onClick={handleIsAscendingChange}
                  className={
                    orderType === "Ascending"
                      ? "bx bx-sort-up"
                      : "bx bx-sort-down"
                  }
                />
                <Select
                  options={sortOptions}
                  onChange={handleSortChange}
                  value={[orderType]}
                />
              </SortSelect>
              <TypeSelect>
                <SortIcon
                  onClick={handleViewChange}
                  className={isGridView ? "bx bx-grid-small" : "bx bx-list-ul"}
                />
                <Select
                  options={viewTypes}
                  onChange={handleViewChange}
                  value={[listValue]}
                />
              </TypeSelect>
            </>
          )}
        </HeaderIconsWrapper>
      </Header>
      <VideoSliderWrapper>
        {!videos.length ? (
          <NoVideosWrapper>No Videos Found</NoVideosWrapper>
        ) : (
          <NoSSR>
            {sliderType === "horizontal" ? (
              <HorizontalSlider
                videos={videos}
                videosPerRow={videosPerRow}
                displayedPosition={displayedPosition}
                setDisplayedPosition={setDisplayedPosition}
                position={position}
              />
            ) : (
              <VerticleSlider
                videos={sortedVideos}
                videosPerRow={videosPerRow}
              />
            )}
          </NoSSR>
        )}
      </VideoSliderWrapper>
    </>
  );
};

export default VideoSlider;
