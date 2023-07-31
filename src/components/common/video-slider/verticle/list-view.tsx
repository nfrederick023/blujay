import { Video } from "@client/utils/types";
import { VideoContext } from "../../contexts/video-context";
import CopyLinkButton from "../../shared/button-icons/buttons/copyLink";
import FavoriteButton from "../../shared/button-icons/buttons/favorite";
import React, { FC, useContext, useState } from "react";
import RequireAuthButton from "../../shared/button-icons/buttons/requireAuth";
import SubredditsSearch from "./search";
import TimeAgo from "react-timeago";
import prettyBytes from "pretty-bytes";
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
  min-height: 48px;
  max-height: 48px;
  align-content: center;
  display: flex;
  flex-wrap: wrap;
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

const Test = styled.div`
  margin: auto 0px auto 0px;
`;

const Buttons = styled.div`
  margin-left: auto;
  display: flex;

  * {
    margin-left: 5px;
  }
`;

const resultsPerPageOptions = ["5", "10", "20", "50", "100"];

interface ListViewProps {
  videos: Video[];
}

const ListView: FC<ListViewProps> = ({ videos }: ListViewProps) => {
  const [paginatedResults, setPaginatedResults] = useState<Video[]>([]);
  const setVideos = useContext(VideoContext).setVideos;

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
                <ListSize>{prettyBytes(video.size)}</ListSize>
                <ListName>
                  <Test>{video.name}</Test>
                  <Buttons>
                    <FavoriteButton handleResponse={updateVideo} video={video} />
                    <CopyLinkButton link={window.location.origin + "/watch/" + video.id} />
                    <RequireAuthButton handleResponse={updateVideo} video={video} showText={false} />
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
