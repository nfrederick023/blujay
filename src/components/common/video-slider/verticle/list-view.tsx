import { Video } from "@client/utils/types";
import { VideoContext } from "../../contexts/video-context";
import CopyLinkButton from "../../shared/button-icons/buttons/copyLink";
import FavoriteButton from "../../shared/button-icons/buttons/favorite";
import React, { FC, useContext, useState } from "react";
import RequireAuthButton from "../../shared/button-icons/buttons/requireAuth";
import TimeAgo from "react-timeago";
import VideoSearch from "./video-search";
import prettyBytes from "pretty-bytes";
import styled from "styled-components";

const SearchResult = styled.div`
  display: flex;
  align-items: center;
  div {
  }
  &:hover {
    background-color: ${(p): string => p.theme.backgroundContrast};
    cursor: pointer;
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

const ListName = styled(ListItem)`
  padding-left: 5px;
  width: 25%;
  min-width: 250px;
`;

const ListUploaded = styled(ListItem)`
  width: 150px;
  min-width: 150px;
`;

const ListUpdated = styled(ListItem)`
  width: 150px;
  min-width: 150px;
`;

const ListSize = styled(ListItem)`
  width: 100px;
  min-width: 100px;
`;

const ListOptions = styled(ListItem)`
  width: 60%;
  padding-right: 5px;
`;

const NoSearchResults = styled.div`
  padding: 6px 0px 6px 0px;
  color: ${(p): string => p.theme.textContrast};
`;

const Icons = styled.div`
  margin-left: auto;
`;

const Test = styled.div`
  margin: auto 10px auto 0px;
  text-overflow: ellipsis;
  overflow: hidden;
  text-wrap: nowrap;
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
  const { setVideos } = useContext(VideoContext);

  const updateVideo = (res: Response, newVideo: Video): void => {
    if (res.ok) setVideos([...videos.filter((video) => video.id !== newVideo.id), newVideo]);
  };

  return (
    <>
      <VideoSearch
        paginatedResults={paginatedResults}
        setPaginatedResults={setPaginatedResults}
        videos={videos}
        resultsPerPageOptions={resultsPerPageOptions}
        intialResultsPerPage={resultsPerPageOptions[2]}
      />
      <SearchHeaderWrapper>
        <FlexWrapper>
          <ListName>
            <div>Name</div>
          </ListName>
          <ListUploaded>
            <div>Uploaded</div>
          </ListUploaded>
          <ListUpdated>
            <div>Updated</div>
          </ListUpdated>
          <ListSize>
            <div>Size</div>
          </ListSize>
          <ListOptions>
            <div>Views</div>
            <Icons>Options</Icons>
          </ListOptions>
        </FlexWrapper>
      </SearchHeaderWrapper>
      {paginatedResults.length ? (
        <>
          {paginatedResults.map((video, i) => {
            return (
              <SearchResult key={i}>
                <ListName>
                  <Test>{video.name}</Test>
                </ListName>
                <ListUploaded>
                  <TimeAgo date={video.uploaded} />
                </ListUploaded>
                <ListUpdated>
                  <TimeAgo date={video.updated} />
                </ListUpdated>
                <ListSize>{prettyBytes(video.size)}</ListSize>
                <ListOptions>
                  <Test>{video.views}</Test>
                  <Buttons>
                    <FavoriteButton handleResponse={updateVideo} video={video} />
                    <CopyLinkButton link={window.location.origin + "/watch/" + video.id} />
                    <RequireAuthButton handleResponse={updateVideo} video={video} showText={false} />
                  </Buttons>
                </ListOptions>
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
