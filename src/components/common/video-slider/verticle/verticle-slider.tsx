import { OrderType, SortType, Video, ViewType } from "@client/utils/types";
import { sortVideos } from "@client/utils/sortVideo";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import ListView from "./list-view";
import React, { FC, useState } from "react";
import VeticleSliderHeader from "./veritcle-header";
import VideoDetails from "../details";
import styled from "styled-components";

const VerticleSliderWrapper = styled.div`
  width: 100%;
`;

const VideoRow = styled.div`
  display: flex;
  margin-bottom: 15px;

  & :not(:last-child) {
    margin-right: 15px;
  }
`;

interface VerticleSliderProps {
  intialOrder?: OrderType;
  intialSort?: SortType;
  videosPerRow: number;
  headerText: string;
  videos: Video[];
}

const VerticleSlider: FC<VerticleSliderProps> = ({
  videosPerRow,
  intialOrder,
  intialSort,
  headerText,
  videos,
}: VerticleSliderProps) => {
  const [sort, setSort] = useState<SortType>(intialSort || "Alphabetical");
  const [order, setOrder] = useState<OrderType>(intialOrder || "Ascending");
  const [view, setView] = useState<ViewType>("Grid View");
  const [numberOfRows, setNumberOfRows] = useState(5);

  if ((numberOfRows - 1) * videosPerRow > videos.length) {
    const rows = Math.ceil(videos.length / videosPerRow);
    setNumberOfRows(rows);
  }

  if (numberOfRows * videosPerRow < videos.length && numberOfRows < 5) {
    setNumberOfRows(5);
  }

  const bottomScrollCallback = (): void => {
    if (numberOfRows * videosPerRow < videos.length) {
      setNumberOfRows(numberOfRows + 8);
    }
  };

  useBottomScrollListener(bottomScrollCallback, {});

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
          {[...Array(numberOfRows)].map((undef, i) => (
            <VideoRow key={i}>
              {[...new Array(videosPerRow)].map((undef, j) => (
                <VideoDetails
                  key={sortedVideos[i * videosPerRow + j]?.id || j}
                  video={sortedVideos[i * videosPerRow + j]}
                />
              ))}
            </VideoRow>
          ))}
        </VerticleSliderWrapper>
      ) : (
        <ListView videos={sortedVideos} />
      )}
    </>
  );
};

export default VerticleSlider;
