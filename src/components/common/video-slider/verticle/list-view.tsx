import { Video } from "@client/utils/types";
import CopyLinkButton from "../../shared/button-icons/buttons/copyLink";
import FavoriteButton from "../../shared/button-icons/buttons/favorite";
import React, { FC, useEffect, useState } from "react";
import RequireAuthButton from "../../shared/button-icons/buttons/requireAuth";
import SubredditsSearch from "./search";
import TimeAgo from "react-timeago";
import styled from "styled-components";
const SearchResult = styled.div`
  display: flex;
  align-items: center;
  div {
  }
`;

const SearchHeaderWrapper = styled.div`
  font-weight: 575;
  font-size: 1.25em;
`;

const FlexWrapper = styled.div`
  display: flex;
  white-space: pre;
`;

const ListItem = styled.div`
  padding: auto;
  min-height: 48px;
  max-height: 48px;
  align-content: center;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  width: 100%;
  border-bottom: 1px solid ${(p): string => p.theme.textContrast};
`;

const ListOptions = styled(ListItem)`
  width: 10%;
`;

const ListSize = styled(ListItem)`
  width: 5%;
`;

const ListName = styled(ListItem)`
  width: 75%;
`;

const NoSearchResults = styled.div`
  padding: 6px 0px 6px 0px;
  color: ${(p): string => p.theme.textContrast};
`;

const Icons = styled.div`
  margin-left: auto;
`;

const Buttons = styled.span`
  margin-left: auto;
  display: flex;

  * {
    margin-left: 5px;
  }
`;

const Icon = styled.div`
  border: 1px solid ${(p): string => p.theme.button};
  border-radius: 5px;
  padding: 6px;
  transition: all 0.1s ease-in;
  user-select: none;
  display: inline-block;

  color: ${(p): string => p.theme.textContrast};

  &:hover {
    cursor: pointer;
    border-color: ${(p): string => p.theme.text};
    color: ${(p): string => p.theme.text};
  }
`;
const resultsPerPageOptions = ["5", "10", "20", "50", "100"];

interface ListViewProps {
  videos: Video[];
}

const ListView: FC<ListViewProps> = ({ videos: _videos }: ListViewProps) => {
  const [videos, setVideos] = useState([..._videos]);
  const [paginatedResults, setPaginatedResults] = useState<Video[]>([]);

  const updateVideo = (res: Response, newVideo: Video): void => {
    if (res.ok) setVideos([...videos.filter((video) => video.id !== newVideo.id), newVideo]);
  };

  return (
    <>
      <SubredditsSearch
        paginatedResults={paginatedResults}
        setPaginatedResults={setPaginatedResults}
        videos={videos}
        resultsPerPageOptions={resultsPerPageOptions}
        intialResultsPerPage={resultsPerPageOptions[2]}
      />
      <SearchHeaderWrapper>
        <FlexWrapper>
          <ListOptions>
            <div>Created</div>
          </ListOptions>
          <ListOptions>
            <div>Uploaded</div>
          </ListOptions>
          <ListSize>
            <div>Size</div>
          </ListSize>
          <ListName>
            <div>Name</div>
            <Icons>Options</Icons>
          </ListName>
        </FlexWrapper>
      </SearchHeaderWrapper>
      {paginatedResults.length ? (
        <>
          {paginatedResults.map((video, i) => {
            return (
              <SearchResult key={i}>
                <ListOptions>
                  <TimeAgo date={video.created} />
                </ListOptions>
                <ListOptions>
                  <TimeAgo date={video.saved} />
                </ListOptions>
                <ListSize>
                  <div>Size</div>
                </ListSize>
                <ListName>
                  {video.name}
                  <Buttons>
                    <FavoriteButton handleResponse={updateVideo} video={video} />
                    <CopyLinkButton link={window.location.origin + "/watch/" + video.id} />
                    <RequireAuthButton handleResponse={updateVideo} video={video} />
                  </Buttons>
                </ListName>
              </SearchResult>
            );
          })}
        </>
      ) : (
        <NoSearchResults>No Subreddits Found!</NoSearchResults>
      )}
    </>
  );
};

export default ListView;
