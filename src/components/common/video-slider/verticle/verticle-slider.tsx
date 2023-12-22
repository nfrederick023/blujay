import { OrderType, SortType, Video, ViewType } from "@client/utils/types";
import { screenSizes } from "@client/utils/constants";
import { sortVideos } from "@client/utils/sortVideo";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import ListView from "./list-view";
import React, { FC, useEffect, useState } from "react";
import VeticleSliderHeader from "./veritcle-header";
import VideoDetails from "../details";
import styled from "styled-components";

const VerticleSliderWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  container-type: inline-size;

  @media (min-width: ${screenSizes.mediumScreenSize}px) {
    div:nth-child(6n) {
      margin-right: 0px;
    }
  }

  @media (max-width: ${screenSizes.mediumScreenSize}px) {
    div:nth-child(4n) {
      margin-right: 0px;
    }
  }

  @media (max-width: ${screenSizes.smallScreenSize}px) {
    div:nth-child(2n) {
      margin-right: 0px;
    }
  }

  @media (max-width: ${screenSizes.tabletScreenSize}px) {
    div:nth-child(1n) {
      margin-right: 0px;
    }
  }
`;

interface VerticleSliderProps {
  intialOrder?: OrderType;
  intialSort?: SortType;
  headerText: string;
  videos: Video[];
  onlyFavorites?: boolean;
  category?: string;
  search?: string;
}

const VerticleSlider: FC<VerticleSliderProps> = ({
  intialOrder,
  intialSort,
  headerText,
  videos,
  onlyFavorites,
  category,
  search,
}) => {
  const [sort, setSort] = useState<SortType>(intialSort || "Alphabetical");
  const [order, setOrder] = useState<OrderType>(intialOrder || "Ascending");
  const [view, setView] = useState<ViewType>("Grid View");
  const [videosDisplayed, setVideosDisplayed] = useState(36); // 36 is arbitrary

  const bottomScrollCallback = (): void => {
    const videosToAdd = 36;
    if (videosDisplayed + videosToAdd > videos.length) {
      setVideosDisplayed(videos.length);
    } else {
      setVideosDisplayed(videosDisplayed + 36);
    }
  };

  useBottomScrollListener(bottomScrollCallback, {
    offset: 200,
    debounce: 0,
    triggerOnNoScroll: true,
  });

  const handleSortChange = (newSort: string): void => {
    setSort(newSort as SortType);
  };

  const handleIsAscendingChange = (): void => {
    if (order === "Ascending") setOrder("Descending");
    else setOrder("Ascending");
  };

  const handleViewChange = (newView: string): void => {
    if (newView === "List View") setView("List View");
    else setView("Grid View");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sortedVideos: Video[] = sortVideos([...videos], sort, order);
  return (
    <>
      <VeticleSliderHeader
        headerText={headerText}
        handleViewChange={handleViewChange}
        handleIsAscendingChange={handleIsAscendingChange}
        handleSortChange={handleSortChange}
        sort={sort}
        order={order}
        view={view}
      />
      {view === "Grid View" ? (
        <VerticleSliderWrapper>
          {sortedVideos.slice(0, videosDisplayed).map((video, i) => (
            <VideoDetails
              key={i}
              video={video}
              sort={sort}
              order={order}
              category={category}
              onlyFavorites={onlyFavorites}
              search={search}
            />
          ))}
        </VerticleSliderWrapper>
      ) : (
        <ListView videos={sortedVideos} />
      )}
    </>
  );
};

export default VerticleSlider;
