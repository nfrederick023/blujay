import { Video } from "@client/utils/types";
import { booleanify } from "@client/utils/cookie";
import { isMediaTypeVideo } from "@client/utils/checkMediaType";
import { screenSizes } from "@client/utils/theme";
import { useCookies } from "react-cookie";
import { useWindowHeight, useWindowWidth } from "@react-hook/window-size";
import CopyLinkButton from "@client/components/common/shared/button-icons/buttons/copyLink";
import FavoriteButton from "@client/components/common/shared/button-icons/buttons/favorite";
import Head from "next/head";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC, SyntheticEvent, useRef, useState } from "react";
import RequireAuthButton from "@client/components/common/shared/button-icons/buttons/requireAuth";
import TheatreModeButton from "@client/components/common/shared/button-icons/buttons/theatreMode";
import TimeAgo from "react-timeago";
import styled from "styled-components";

const VideoContainer = styled.div`
  max-width: ${(p: { maxWidth: number }): number => p.maxWidth}px;
  height: 100vh;
  margin: auto;
`;

const BlackOverlay = styled.div`
  position: absolute;
  background: black;
  max-height: ${(p: { height: number }): number => p.height}px;
  min-height: ${(p: { height: number }): number => p.height}px;
  width: 100vw;
  right: 0px;
  z-index: -1;
`;

const VideoPlayer = styled.video`
  width: ${(p: { maxWidth: number; maxHeight: number }): number => p.maxWidth}px;
  max-height: ${(p): number => p.maxHeight}px;
  width: 100%;
  aspect-ratio: 16/9;
`;

const Image = styled.img`
  width: ${(p: { maxWidth: number; maxHeight: number }): number => p.maxWidth}px;
  max-height: ${(p): number => p.maxHeight}px;
  object-fit: contain;
  width: 100%;
`;

const VideoDetails = styled.div`
  color: ${(p): string => p.theme.textContrastLight};
`;

const Buttons = styled.span`
  margin-left: auto;
  display: flex;

  * {
    margin-left: 5px;
  }
`;

const VideoNameContainer = styled.div`
  margin-top: 5px;
  display: flex;
`;

const VideoName = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledMeta = styled.meta`` as any;

interface WatchPageProps {
  video: Video;
  url: string;
}

const WatchPage: FC<WatchPageProps> = ({ video: originalVideo, url }) => {
  const [video, setVideo] = useState(originalVideo);
  const [cookies] = useCookies(["videoVolume", "isSidebarEnabled", "isTheatreMode"]);
  const [dimensions, setDimensions] = useState({ height: 1, width: 1 });
  const ref = useRef<HTMLVideoElement & HTMLImageElement>(null);
  const windowHeight = useWindowHeight();
  const windowWidth = useWindowWidth();
  const isSidebarEnabled = booleanify(cookies.isSidebarEnabled);
  const isVideo = isMediaTypeVideo(originalVideo.extentsion);
  const isTheatreMode = booleanify(cookies.isTheatreMode);

  const handleVolumeChange = (): void => {};

  const updateVideo = (res: Response, newVideo: Video): void => {
    if (res.ok) setVideo(newVideo);
  };

  const searchbarSize = 90;
  const descriptionSize = 60;
  const sideBarSize = isSidebarEnabled && windowWidth > screenSizes.tabletScreenSize ? 250 : 0;
  const leftRightPadding = windowWidth < screenSizes.smallScreenSize ? 0 : 80;
  const marginSize = 60;

  let maxHeight = windowHeight - descriptionSize - searchbarSize - marginSize;
  let maxWidth = windowWidth - sideBarSize - leftRightPadding - marginSize;

  const expectedWidth = dimensions.width * (maxHeight / dimensions.height);
  const expectedHeight = dimensions.height * (maxWidth / dimensions.width);

  let actualHeight = 0;
  let actualWidth = 0;

  // todo clean up and explain this garbage logic
  if (dimensions.width > dimensions.height) {
    if (expectedWidth < maxWidth) maxWidth = expectedWidth;
    actualHeight = dimensions.height * (maxWidth / dimensions.width);
    actualWidth = maxWidth;
  } else {
    if (expectedHeight < maxHeight) maxHeight = expectedHeight;
    actualHeight = maxHeight;
    actualWidth = dimensions.width * (maxHeight / dimensions.height);
  }

  if (maxHeight < 1) maxHeight = 1;
  if (maxWidth < 1) maxWidth = 1;

  if (!isTheatreMode) {
    actualHeight = Math.min(windowHeight * ((windowWidth * 0.6) / windowWidth), windowHeight * 0.75);
    actualWidth = Math.min(dimensions.width * (actualHeight / dimensions.height), windowWidth * 0.75);
  }

  const onLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement, Event>): void => {
    const videoEl = event.target as HTMLVideoElement;
    setDimensions({ height: videoEl.videoHeight, width: videoEl.videoWidth });
  };

  const onLoad = (event: SyntheticEvent<HTMLImageElement, Event>): void => {
    const imageEl = event.target as HTMLImageElement;
    setDimensions({ height: imageEl.naturalHeight, width: imageEl.naturalWidth });
  };

  const _url = new URL(url);
  const src = `${_url.protocol}//${_url.host}`;
  const videoSrc = `/api/watch/${encodeURIComponent(video.id)}.${video.extentsion}`;
  const thumbSrc = "/api/thumb/" + encodeURIComponent(video.id);
  const fullVideoURL = `${src}${videoSrc}`;
  const fullThumbSrc = `${src}${thumbSrc}`;

  console.log(url);

  return (
    <>
      <Head>
        <title>{video.name + "page title goes here"}</title>
        <StyledMeta property="og:type" value="videoDetails.other" />
        <StyledMeta property="og:site_name" value={"page title goes here"} />
        <StyledMeta property="og:url" value={url} />
        <StyledMeta property="og:title" value={video.name} />
        <StyledMeta property="og:image" content={fullThumbSrc} />
        <StyledMeta property="og:image:secure_url" content={fullThumbSrc} />
        <StyledMeta property="og:image:type" content="image/jpeg" />
        <StyledMeta property="og:image:width" content="1920" />
        <StyledMeta property="og:image:height" content="1080" />
        <StyledMeta property="og:description" value="na" />
        <StyledMeta property="og:video" value={fullVideoURL} />
        <StyledMeta property="og:video:url" value={fullVideoURL} />
        <StyledMeta property="og:video:secure_url" value={fullVideoURL} />
        <StyledMeta property="og:video:type" content={originalVideo.mimeType} />
        <StyledMeta property="og:video:width" content="1280" />
        <StyledMeta property="og:video:height" content="720" />
        <StyledMeta name="twitter:card" content="player" />
        <StyledMeta name="twitter:site" content="@streamable" />
        <StyledMeta name="twitter:image" content={fullThumbSrc} />
        <StyledMeta name="twitter:player:width" content="1280" />
        <StyledMeta name="twitter:player:height" content="720" />
        <StyledMeta name="twitter:player" content={url} />
      </Head>
      <NoSSR>
        <VideoContainer maxWidth={actualWidth}>
          {/* <Header>
            <div>back</div>
            <div>next</div>
          </Header> */}
          <BlackOverlay height={isTheatreMode ? actualHeight : 0} />
          {isVideo ? (
            <VideoPlayer
              src={videoSrc}
              ref={ref}
              maxWidth={actualWidth}
              maxHeight={actualHeight}
              controls
              autoPlay
              onLoadedMetadata={onLoadedMetadata}
              onVolumeChange={handleVolumeChange}
            />
          ) : (
            <Image ref={ref} src={videoSrc} maxWidth={actualWidth} maxHeight={actualHeight} onLoad={onLoad} />
          )}
          <VideoNameContainer>
            <VideoName>
              <h4>{video.name}</h4>
            </VideoName>
            <Buttons>
              <FavoriteButton handleResponse={updateVideo} video={video} />
              <CopyLinkButton link={url} />
              <RequireAuthButton handleResponse={updateVideo} video={video} showText={true} />
              <TheatreModeButton />
            </Buttons>
          </VideoNameContainer>
          <VideoDetails>
            <h6>
              {video.category} · <TimeAgo date={video.created} />
            </h6>
          </VideoDetails>
          {video.description && <div className="content">{video.description}</div>}
        </VideoContainer>
      </NoSSR>
    </>
  );
};

export default WatchPage;
