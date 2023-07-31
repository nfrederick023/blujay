import { BluJayTheme, Video } from "@client/utils/types";
import React, { FC, useEffect, useState } from "react";
import Select from "../../shared/select";
import styled from "styled-components";

const PageButtonContainer = styled.div`
  display: flex;
  margin-bottom: 3px;
`;

const PageButton = styled.div`
  color: ${(p): string => p.theme.textContrast};
  width: 38px;
  height: 38px;
  border: 1px solid ${(p): string => p.theme.textContrast};
  border-radius: 5px;
  text-align: center;
  display: grid;
  margin-right: 3px;
  align-content: center;
  user-select: none;
  transition: 0.2s;
  &:hover {
    cursor: pointer;
    border: 1px solid ${(p): string => p.theme.highlightDark};
    color: ${(p): string => p.theme.text};
  }
  ${(p: { isSelected: boolean; theme: BluJayTheme }): string =>
    p.isSelected
      ? `border: 1px solid ${p.theme.highlightDark}; color: ${p.theme.text}; background-color: ${p.theme.highlightDark}`
      : ""};
`;

const ResultsPerPageWrapper = styled.div`
  width: 70px;
  margin-right: 3px;
  margin-left: auto;
  align-content: center;
  height: 38px;
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  padding: auto;
  flex-wrap: wrap;
  border: 1px solid ${(p): string => p.theme.textContrast};
  border-radius: 5px;
`;

interface SubredditSearchProps {
  videos: Video[];
  paginatedResults: Video[];
  resultsPerPageOptions: string[];
  intialResultsPerPage: string;
  setPaginatedResults: React.Dispatch<React.SetStateAction<Video[]>>;
  paginationFilter?: (result: Video) => boolean;
}

const SubredditsSearch: FC<SubredditSearchProps> = ({
  videos,
  paginatedResults,
  resultsPerPageOptions,
  intialResultsPerPage,
  setPaginatedResults,
  paginationFilter,
}: SubredditSearchProps) => {
  const [resultsPerPage, setResultsPerPage] = useState(Number(intialResultsPerPage));
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageChange = (page: number) => (): void => {
    setCurrentPage(page);
    paginateResults();
  };

  const handleResultsPerPageChange = (newResultsPerPage: string): void => {
    setResultsPerPage(Number(newResultsPerPage));
    paginateResults();
  };

  const numberOfPages = Math.ceil(videos.length / (resultsPerPage ? resultsPerPage : 1));

  if (currentPage !== 0 && currentPage > numberOfPages - 1) setCurrentPage(numberOfPages - 1);

  const paginateResults = (): void => {
    let videosSlice: Video[] = videos;

    if (paginationFilter) {
      videosSlice = videos.filter(paginationFilter);
    }

    videosSlice = videosSlice.slice(currentPage * resultsPerPage, currentPage * resultsPerPage + resultsPerPage);

    const updatePagination = videosSlice.filter((result) => {
      return !paginatedResults.includes(result);
    });

    if (updatePagination.length || videosSlice.length !== paginatedResults.length) setPaginatedResults(videosSlice);
  };

  useEffect(() => {
    paginateResults();
  });

  return (
    <>
      <PageButtonContainer>
        {[...new Array(numberOfPages)].map((undef, i) => {
          return (
            <PageButton key={i} isSelected={i === currentPage} onClick={handlePageChange(i)}>
              {i + 1}
            </PageButton>
          );
        })}
        <ResultsPerPageWrapper>
          <Select
            options={resultsPerPageOptions}
            onChange={handleResultsPerPageChange}
            value={[resultsPerPage.toString()]}
            defaultSelected={[resultsPerPage.toString()]}
          />
        </ResultsPerPageWrapper>
      </PageButtonContainer>
    </>
  );
};

export default SubredditsSearch;
