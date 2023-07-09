import { Video } from "@client/utils/types";
import Head from "next/head";
import React, { FC } from "react";
import TimeAgo from "react-timeago";
import styled from "styled-components";

const WatchPageContainer = styled.div`
  margin: 40px 150px 0px 150px;
`;

const VideoPlayer = styled.video`
  width: 100%;
  margin-bottom: 5px;
`;

const VideoDescription = styled.div`
  margin-top: 25px;
`;

const VideoDetails = styled.div`
  color: ${(p): string => p.theme.textContrastLight};
`;

const Buttons = styled.span`
  margin-left: auto;
  display: flex;
`;

const ButtonIcon = styled.div`
  background: ${(p): string => p.theme.button};
  font-size: 0.9em;
  height: 100%;
  border-radius: 8px;
  padding: 5px;
  margin-left: 5px;
  min-width: 32px;
  max-height: 32px;
  text-align: center;

  i {
    font-size: 1.1em !important;
    vertical-align: bottom;
  }
`;

const IconWithText = styled.i`
  padding-right: 5px;
`;

const VideoName = styled.div`
  display: flex;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledMeta = styled.meta`` as any;

interface WatchPageProps {
  video: Video;
  url: string;
  mimeType: string;
}

const WatchPage: FC<WatchPageProps> = ({ video, url, mimeType }) => {
  const _url = new URL(url);
  const src = `${_url.protocol}//${_url.host}`;
  const videoSrc = "/api/watch/" + encodeURIComponent(video.id) + ".mp4";
  const thumbSrc = "/api/thumb/" + encodeURIComponent(video.id);
  const fullVideoURL = `${src}${videoSrc}`;
  const fullThumbSrc = `${src}${thumbSrc}`;
  const handleVolumeChange = (): void => {};

  return (
    <WatchPageContainer>
      <>
        <Head>
          <title>{video.name + "page title goes here"}</title>
          <StyledMeta property="og:type" value="video.other" />
          <StyledMeta property="og:site_name" value={"page title goes here"} />
          <StyledMeta property="og:url" value={url} />
          <StyledMeta property="og:title" value={video.name} />
          <StyledMeta property="og:image" content={fullThumbSrc} />
          <StyledMeta property="og:image:secure_url" content={fullThumbSrc} />
          <StyledMeta property="og:image:type" content="image/jpeg" />
          <StyledMeta property="og:image:width" content="1280" />
          <StyledMeta property="og:image:height" content="720" />
          <StyledMeta property="og:description" value="na" />
          <StyledMeta property="og:video" value={fullVideoURL} />
          <StyledMeta property="og:video:url" value={fullVideoURL} />
          <StyledMeta property="og:video:secure_url" value={fullVideoURL} />
          <StyledMeta property="og:video:type" content={mimeType.toString()} />
          <StyledMeta property="og:video:width" content="1280" />
          <StyledMeta property="og:video:height" content="720" />
          <StyledMeta name="twitter:card" content="player" />
          <StyledMeta name="twitter:site" content="@streamable" />
          <StyledMeta name="twitter:image" content={fullThumbSrc} />
          <StyledMeta name="twitter:player:width" content="1280" />
          <StyledMeta name="twitter:player:height" content="720" />
          <StyledMeta name="twitter:player" content={url} />
        </Head>
      </>

      <VideoPlayer
        id="video"
        src={videoSrc}
        controls
        autoPlay
        onVolumeChange={handleVolumeChange}
      />
      <VideoName>
        <h4>{video.name}</h4>
        <Buttons>
          <ButtonIcon>
            <i className="bx bx-heart" />
          </ButtonIcon>
          <ButtonIcon>
            <i className="bx bx-link" />
          </ButtonIcon>
          <ButtonIcon>
            <IconWithText className="bx bx-globe" />
            <h6>Public</h6>
          </ButtonIcon>
          <ButtonIcon>
            <IconWithText className="bx bx-movie" />
            <h6>Theatre Mode</h6>
          </ButtonIcon>
        </Buttons>
      </VideoName>
      {/* <h6>
        Uploaded <TimeAgo date={video.saved} />
        <span style={{ margin: "0px 10px" }}>•</span>
        {prettyBytes(video.size)}
        <span style={{ margin: "0px 10px" }}>•</span>
        {video.fileName}
      </h6> */}
      <VideoDetails>
        <h6>
          {video.category} · <TimeAgo date={video.created} />
        </h6>
      </VideoDetails>
      {video.description && (
        <VideoDescription className="content">
          {video.description}
        </VideoDescription>
      )}
    </WatchPageContainer>
  );
};

export default WatchPage;
