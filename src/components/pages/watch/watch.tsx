import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { booleanify } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/constants";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useWindowHeight, useWindowWidth } from "@react-hook/window-size";
import ButtonIcon from "@client/components/common/shared/button-icons/button-icon";
import CopyLinkButton from "@client/components/common/shared/button-icons/buttons/copyLink";
import FavoriteButton from "@client/components/common/shared/button-icons/buttons/favorite";
import Head from "next/head";
import NoSSR from "@mpth/react-no-ssr";
import React, { FC, SyntheticEvent, useContext, useEffect, useRef, useState } from "react";
import RequireAuthButton from "@client/components/common/shared/button-icons/buttons/requireAuth";
import TheatreModeButton from "@client/components/common/shared/button-icons/buttons/theatreMode";
import TimeAgo from "react-timeago";
import styled from "styled-components";

const VideoContainer = styled.div`
  max-width: ${(p: { maxWidth: number }): number => p.maxWidth}px;
  height: 100%;
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
  height: ${(p): number => p.maxHeight}px;
  width: 100%;
  aspect-ratio: 16/9;
`;

const Image = styled.img`
  width: ${(p: { maxWidth: number; maxHeight: number }): number => p.maxWidth}px;
  max-height: ${(p): number => p.maxHeight}px;
  height: ${(p): number => p.maxHeight}px;
  object-fit: contain;
  cursor: zoom-in;
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

const Overlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 6;
  cursor: zoom-out;
`;

const OverlayImage = styled.img`
  position: fixed;
  max-height: 95%;
  width: 100%;
  object-fit: contain;
  cursor: zoom-in;
  z-index: 7;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: zoom-out;
`;

const PageOptions = styled.div`
  display: flex;
  margin-bottom: 5px;
`;

const BackButton = styled(ButtonIcon)`
  margin-right: auto;
`;

const PeviousVideoButton = styled(ButtonIcon)`
  margin-right: 5px;
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledMeta = styled.meta`` as any;

interface WatchPageProps {
  selectedVideo: Video;
  sortedVideos: Video[];
  videos: Video[];
  url: string;
  params: string;
}

const WatchPage: FC<WatchPageProps> = ({ selectedVideo, url, sortedVideos, params, videos }) => {
  const [cookies] = useCookies(["videoVolume", "isSidebarEnabled", "isTheaterMode"]);
  const [video, setVideo] = useState(videos.find((video) => video.id === selectedVideo.id));
  const currentVideoIndex = sortedVideos.findIndex((_video) => _video.id === video?.id);
  const [dimensions, setDimensions] = useState({ height: 1, width: 1 });
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLVideoElement & HTMLImageElement>(null);
  const windowHeight = useWindowHeight();
  const windowWidth = useWindowWidth({ wait: 10 });
  const isSidebarEnabled = booleanify(cookies.isSidebarEnabled);
  const isTheatreMode = booleanify(cookies.isTheaterMode);
  const { updateVideo } = useContext(VideoContext);
  const nextVideo = sortedVideos[currentVideoIndex + 1];
  const previousVideo = sortedVideos[currentVideoIndex - 1];
  const router = useRouter();

  if (!video) {
    return <></>;
  }

  const handleVolumeChange = (): void => {
    //
  };

  const goBack = (): void => {
    router.back();
  };

  const setZoomedIn = (): void => {
    setIsZoomedIn(true);
  };

  const setZoomedOut = (): void => {
    setIsZoomedIn(false);
  };

  const videoResponseUpdate = (res: Response, newVideo: Video): void => {
    if (res.ok) updateVideo(newVideo);
  };

  const goToNextVideo = (): void => {
    if (nextVideo) {
      setVideo(nextVideo);
      navigateToVideo(nextVideo);
    }
  };
  const goToPreviousVideo = (): void => {
    if (previousVideo) {
      setVideo(previousVideo);
      navigateToVideo(previousVideo);
    }
  };

  const navigateToVideo = (videoToNavigateTo: Video): void => {
    router.replace(
      {
        pathname: "/watch/" + videoToNavigateTo.id,
        query: params,
      },
      undefined,
      { shallow: true }
    );
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
    setIsLoaded(true);
  };

  const onLoad = (event: SyntheticEvent<HTMLImageElement, Event>): void => {
    const imageEl = event.target as HTMLImageElement;
    setDimensions({ height: imageEl.naturalHeight, width: imageEl.naturalWidth });
    setIsLoaded(true);
  };

  const handleKeyDown = (e: KeyboardEvent): void => {
    const key = e.key;
    if (key === "ArrowRight") {
      goToNextVideo();
    }

    if (key === "ArrowLeft") {
      goToPreviousVideo();
    }
  };

  const _url = new URL(url);
  const src = `${_url.protocol}//${_url.host}`;
  const videoSrc = `/api/watch/${encodeURIComponent(video.id)}.${video.extentsion}`;
  const thumbSrc = "/api/thumb/" + encodeURIComponent(video.id);
  const fullVideoURL = `${src}${videoSrc}`;
  const fullThumbSrc = `${src}${thumbSrc}`;
  const title = "Blujay · " + video.name;

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [video]);

  return (
    <>
      <Head>
        <title>{title}</title>
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
        <StyledMeta property="og:video:type" content={video.mimeType} />
        <StyledMeta property="og:video:width" content="1280" />
        <StyledMeta property="og:video:height" content="720" />
        <StyledMeta name="twitter:card" content="player" />
        <StyledMeta name="twitter:site" content="@streamable" />
        <StyledMeta name="twitter:image" content={fullThumbSrc} />
        <StyledMeta name="twitter:player:width" content="1280" />
        <StyledMeta name="twitter:player:height" content="720" />
        <StyledMeta name="twitter:player" content={url} />
      </Head>
      {isZoomedIn ? (
        <>
          <Overlay onClick={setZoomedOut}></Overlay>
          <OverlayImage onClick={setZoomedOut} src={videoSrc} draggable={false}></OverlayImage>
        </>
      ) : (
        <></>
      )}
      <NoSSR>
        <VideoContainer maxWidth={actualWidth}>
          <PageOptions>
            <BackButton icon="bx bx-arrow-back" hoverTextOn="Go Back" onClick={goBack}></BackButton>
            <PeviousVideoButton
              icon="bx bx-chevron-left"
              hoverTextOn="Previous Video"
              onClick={goToPreviousVideo}
              disabled={!previousVideo}
            ></PeviousVideoButton>
            <ButtonIcon
              icon="bx bx-chevron-right"
              hoverTextOn="Next Video"
              onClick={goToNextVideo}
              disabled={!nextVideo}
            ></ButtonIcon>
          </PageOptions>
          {isLoaded && <BlackOverlay height={isTheatreMode ? actualHeight : 0} />}
          {video.type === "video" ? (
            <VideoPlayer
              src={videoSrc}
              ref={ref}
              maxWidth={actualWidth}
              maxHeight={actualHeight}
              controls
              autoPlay
              onLoadedMetadata={onLoadedMetadata}
              onVolumeChange={handleVolumeChange}
              draggable={false}
            />
          ) : (
            <Image
              ref={ref}
              src={videoSrc}
              maxWidth={actualWidth}
              maxHeight={actualHeight}
              onLoad={onLoad}
              onClick={setZoomedIn}
              draggable={false}
            />
          )}
          <VideoNameContainer>
            <VideoName>
              <h4>{video.name}</h4>
            </VideoName>
            <Buttons>
              <FavoriteButton handleResponse={videoResponseUpdate} video={video} />
              <CopyLinkButton link={url} />
              <RequireAuthButton handleResponse={videoResponseUpdate} video={video} showText={true} />
              <TheatreModeButton />
            </Buttons>
          </VideoNameContainer>
          <VideoDetails>
            <h6>
              {video.category ? <>{video.category} ·</> : <></>} <TimeAgo date={video.updated} /> · {video.views} views
            </h6>
          </VideoDetails>
          {video.description && <div className="content">{video.description}</div>}
        </VideoContainer>
      </NoSSR>
    </>
  );
};

export default WatchPage;
