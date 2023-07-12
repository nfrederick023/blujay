import { Video } from "@client/utils/types";
import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/theme";
import { updateVideo } from "@client/utils/api";
import { useCookies } from "react-cookie";
import { useWindowHeight, useWindowWidth } from "@react-hook/window-size";
import ButtonIcon from "@client/components/common/shared/button-icon";
import Head from "next/head";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC, SyntheticEvent, useEffect, useRef, useState } from "react";
import TimeAgo from "react-timeago";
import styled, { FlattenSimpleInterpolation, css } from "styled-components";

const VideoContainer = styled.div`
  margin: auto;
  width: ${(p: { theatreWidth: number }): number => p.theatreWidth}px;
`;

const BlackOverlay = styled.div`
  position: absolute;
  background: black;
  height: ${(p: { theatreHeight: number }): number => p.theatreHeight}px;
  width: 100vw;
  right: 0px;
  z-index: -1;
`;

//  ${(p: {
//     isTheatreMode: boolean;
//     height: number;
//   }): FlattenSimpleInterpolation | string =>
//     p.isTheatreMode
//       ? css`
//           background: black;
//           align-items: center;
//           display: flex;
//           height: ${p.height}px;
//           max-height: calc(100vh - 60px - 80px);
//           width: 100%;
//         `
//       : ""}

const VideoPlayer = styled.video`
  margin: auto;
  width: ${(p: { theatreWidth: number }): number => p.theatreWidth}px;
`;

const VideoDetails = styled.div`
  color: ${(p): string => p.theme.textContrastLight};
`;

const Buttons = styled.span`
  margin-left: auto;
  display: flex;
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
  const [videoDetails, setVideoDetails] = useState(video);
  const [cookies, setCookie] = useCookies(["isTheaterMode", "videoVolume"]);
  const windowHeight = useWindowHeight();
  const windowWidth = useWindowWidth();
  const [vDimensions, setVDimensions] = useState({ height: 1920, width: 1080 });
  const isTheatreMode = booleanify(cookies.isTheaterMode);

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

  const onLoadedMetadata = (videoMeta: SyntheticEvent<HTMLVideoElement, Event>): void => {
    const videoEl = videoMeta.target as HTMLVideoElement;
    setVDimensions({ height: videoEl.videoHeight, width: videoEl.videoWidth });
  };

  // 60 is search, 80 is description
  // 160 is the padding (80 left 80 right)
  const leftRightPadding = 100;

  // find the max height given the current size of the window
  const maxHeight = Math.min(
    windowHeight - 60 - 50,
    vDimensions.height * ((windowWidth - leftRightPadding) / vDimensions.width)
  );

  // use the max height to determine what the width should be given the current size of the window
  const theatreWidth = Math.min(
    screenSizes.largeScreenSize,
    vDimensions.width * (maxHeight / vDimensions.height) - leftRightPadding
  );

  // and now that we've found the width, get the actual height
  const theatreHeight = vDimensions.height * (theatreWidth / vDimensions.width);

  if (isTheatreMode) {
  }

  const _url = new URL(url);
  const src = `${_url.protocol}//${_url.host}`;
  const videoSrc = `/api/watch/${encodeURIComponent(videoDetails.id)}.${videoDetails.extentsion}`;

  const thumbSrc = "/api/thumb/" + encodeURIComponent(videoDetails.id);
  const fullVideoURL = `${src}${videoSrc}`;
  const fullThumbSrc = `${src}${thumbSrc}`;

  return (
    <>
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
        {isTheatreMode && <BlackOverlay theatreHeight={theatreHeight} />}
        <VideoContainer theatreWidth={theatreWidth}>
          <VideoPlayer
            id="video"
            src={videoSrc}
            theatreWidth={theatreWidth}
            controls
            autoPlay
            onLoadedMetadata={onLoadedMetadata}
            onVolumeChange={handleVolumeChange}
          />
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
    </>
  );
};

export default WatchPage;
