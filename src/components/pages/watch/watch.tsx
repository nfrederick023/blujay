import { Video } from "@client/utils/types";
import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { isMediaTypeVideo } from "@client/utils/checkMediaType";
import { screenSizes } from "@client/utils/theme";
import { updateVideo } from "@client/utils/api";
import { useCookies } from "react-cookie";
import { useWindowHeight, useWindowWidth } from "@react-hook/window-size";
import ButtonIcon from "@client/components/common/shared/button-icon";
import Head from "next/head";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC, SyntheticEvent, useRef, useState } from "react";
import TimeAgo from "react-timeago";
import styled from "styled-components";
import useResizeObserver from "use-resize-observer";

const VideoContainer = styled.div`
  padding: 0px 40px 0px 40px;
  max-width: ${(p: { maxWidth: number }): number => p.maxWidth}px;
  margin: auto;
`;

const BlackOverlay = styled.div`
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    99% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  animation: fadeIn 0.21s linear 1 forwards;
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
  margin: auto;
  width: 100%;
  aspect-ratio: 16/9;
`;

const Image = styled.img`
  max-width: ${(p: { maxWidth: number; maxHeight: number }): number => p.maxWidth}px;
  max-height: ${(p): number => p.maxHeight}px;
  object-fit: contain;
  margin: auto;
  width: 100%;
`;

const VideoDetails = styled.div`
  color: ${(p): string => p.theme.textContrastLight};
`;

const Buttons = styled.span`
  margin-left: auto;
  display: flex;
`;

const VideoName = styled.div`
  margin-top: 5px;
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
  const [videoDetails, setVideoDetails] = useState(video);
  const [cookies, setCookie] = useCookies(["isTheaterMode", "videoVolume", "isSidebarEnabled"]);
  const [dimensions, setDimensions] = useState({ height: 1, width: 1 });
  const ref = useRef<HTMLVideoElement & HTMLImageElement>();
  const windowHeight = useWindowHeight();
  const windowWidth = useWindowWidth();
  const isTheatreMode = booleanify(cookies.isTheaterMode);
  const isVideo = isMediaTypeVideo(video.extentsion);

  const handleVolumeChange = (): void => {};

  const handleSetAsFavorite = async (): Promise<void> => {
    const newVideo: Video = { ...videoDetails, isFavorite: !videoDetails.isFavorite };
    const res = await updateVideo(newVideo);
    if (res.ok) setVideoDetails(newVideo);
  };

  const handleCopyLink = (): void => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleSetVisibility = async (): Promise<void> => {
    const newVideo: Video = { ...videoDetails, requireAuth: !videoDetails.requireAuth };
    const res = await updateVideo(newVideo);
    if (res.ok) setVideoDetails(newVideo);
  };

  const handleSetViewMode = (): void => {
    setCookie("isTheaterMode", !isTheatreMode, getCookieSetOptions());
  };

  let maxHeight = windowHeight - 60 - 90;
  let maxWidth = windowWidth - 180;

  const expectedWidth = dimensions.width * (maxHeight / dimensions.height);
  const expectedHeight = dimensions.height * (maxWidth / dimensions.width);

  let actualHeight;

  if (dimensions.width > dimensions.height) {
    actualHeight = expectedHeight;
    if (expectedWidth < maxWidth) maxWidth = expectedWidth;
  } else {
    actualHeight = maxHeight;
    if (expectedHeight < maxHeight) maxHeight = expectedHeight;
  }

  if (maxHeight < 1) maxHeight = 1;
  if (maxWidth < 1) maxWidth = 1;

  if (!isTheatreMode) maxWidth = screenSizes.smallScreenSize;

  const onLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement, Event>): void => {
    const videoEl = event.target as HTMLVideoElement;
    setDimensions({ height: videoEl.videoHeight, width: videoEl.videoWidth });
  };

  const onLoad = (event: SyntheticEvent<HTMLImageElement, Event>): void => {
    const imageEl = event.target as HTMLImageElement;
    setDimensions({ height: imageEl.naturalHeight, width: imageEl.naturalWidth });
  };

  //if (!isTheatreMode) maxWidth = screenSizes.smallScreenSize;

  const _url = new URL(url);
  const src = `${_url.protocol}//${_url.host}`;
  const videoSrc = `/api/watch/${encodeURIComponent(videoDetails.id)}.${videoDetails.extentsion}`;
  const thumbSrc = "/api/thumb/" + encodeURIComponent(videoDetails.id);
  const fullVideoURL = `${src}${videoSrc}`;
  const fullThumbSrc = `${src}${thumbSrc}`;

  return (
    <div>
      <Head>
        <title>{videoDetails.name + "page title goes here"}</title>
        <StyledMeta property="og:type" value="videoDetails.other" />
        <StyledMeta property="og:site_name" value={"page title goes here"} />
        <StyledMeta property="og:url" value={url} />
        <StyledMeta property="og:title" value={videoDetails.name} />
        <StyledMeta property="og:image" content={fullThumbSrc} />
        <StyledMeta property="og:image:secure_url" content={fullThumbSrc} />
        <StyledMeta property="og:image:type" content="image/jpeg" />
        <StyledMeta property="og:image:width" content="1920" />
        <StyledMeta property="og:image:height" content="1080" />
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
      <NoSSR>
        {isTheatreMode && <BlackOverlay height={actualHeight} />}
        <VideoContainer maxWidth={maxWidth}>
          {isVideo ? (
            <VideoPlayer
              src={videoSrc}
              ref={ref}
              maxWidth={maxWidth}
              maxHeight={maxHeight}
              controls
              autoPlay
              onLoadedMetadata={onLoadedMetadata}
              onVolumeChange={handleVolumeChange}
            />
          ) : (
            <Image ref={ref} src={videoSrc} maxWidth={maxWidth} maxHeight={maxHeight} onLoad={onLoad} />
          )}
          <VideoName>
            <h4>{videoDetails.name}</h4>
            <Buttons>
              <ButtonIcon
                icon="bx bx-heart"
                selectedIcon="bx bxs-heart"
                onClick={handleSetAsFavorite}
                isSelected={videoDetails.isFavorite}
                hoverTextOn="Remove as Favorite"
                hoverTextOff="Add as Favorite"
                confrimTextOn="Added!"
                confrimTextOff="Removed!"
              />
              <ButtonIcon icon="bx bx-link" onClick={handleCopyLink} hoverTextOn="Copy Link" confrimTextOn="Copied!" />
              <ButtonIcon
                isSelected={!videoDetails.requireAuth}
                selectedIcon="bx bx-globe"
                icon="bx bx-lock-alt"
                hoverTextOn="Set as Private"
                hoverTextOff="Set as Public"
                confrimTextOn="Public!"
                confrimTextOff="Private!"
                textOn="Public"
                textOff="Private"
                onClick={handleSetVisibility}
              />
              <ButtonIcon
                icon="bx bx-movie"
                selectedIcon="bx bx-movie"
                textOn="Theatre Mode"
                isSelected={isTheatreMode}
                hoverTextOn="Close Theatre Mode"
                hoverTextOff="Open Theatre Mode"
                confrimTextOn="Opened!"
                confrimTextOff="Closed!"
                onClick={handleSetViewMode}
              />
            </Buttons>
          </VideoName>
          <VideoDetails>
            <h6>
              {videoDetails.category} · <TimeAgo date={videoDetails.created} />
            </h6>
          </VideoDetails>
          {videoDetails.description && <div className="content">{videoDetails.description}</div>}
        </VideoContainer>
      </NoSSR>
    </div>
  );
};

export default WatchPage;
