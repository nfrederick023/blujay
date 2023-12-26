import { DropDownOption, OrderType, SortType, Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { booleanify } from "@client/utils/cookie";
import { getVideoCategory, sortVideos } from "@client/utils/sortVideo";
import { screenSizes } from "@client/utils/constants";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import ButtonIcon from "@client/components/common/shared/button-icons/button-icon";
import CopyLinkButton from "@client/components/common/shared/button-icons/buttons/copy-link";
import DownloadButton from "@client/components/common/shared/button-icons/buttons/download";
import DropDown from "@client/components/common/shared/drop-down";
import FavoriteButton from "@client/components/common/shared/button-icons/buttons/favorite";
import Head from "next/head";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import RequireAuthButton from "@client/components/common/shared/button-icons/buttons/require-auth";
import TheatreModeButton from "@client/components/common/shared/button-icons/buttons/theatre-mode";
import TimeAgo from "react-timeago";
import VideoSettingsButton from "@client/components/common/shared/button-icons/buttons/video-settings";
import styled from "styled-components";

const VideoContainer = styled.div`
  margin: auto;
  max-width: ${(p: { isTheaterMode: boolean }): string => (p.isTheaterMode ? "75%" : "60%")};

  @media (max-width: ${screenSizes.smallScreenSize}px) {
    max-width: unset;
  }
`;

const BlackOverlay = styled.div`
  position: absolute;
  background: black;
  width: 120vw;
  height: 100%;
  z-index: -1;
`;

const VideoPlayer = styled.video`
  width: 100%;
  height: calc(100cqw / 16 * 9);
  aspect-ratio: 16 / 9;
`;

const Image = styled.img`
  object-fit: contain;
  cursor: zoom-in;
  width: 100%;
  height: calc(100cqw / 16 * 9);
`;

const VideoWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: black;
  container-type: inline-size;
  line-height: 0;
`;

const Buttons = styled.span`
  margin-left: auto;
  display: flex;

  & > * {
    margin-left: 5px;
  }
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

const VideoDetailsWrapper = styled.div`
  display: flex;
`;

const VideoDetails = styled.div``;

const VideoMetadata = styled.div`
  color: ${(p): string => p.theme.textContrastLight};
`;

const VideoOptions = styled.div`
  margin-left: auto;
`;

const VideoName = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const MoreButton = styled.span`
  cursor: pointer;

  &:hover {
    color: ${(p): string => p.theme.text};
  }
`;

const LessButton = styled.span`
  cursor: pointer;

  &:hover {
    color: ${(p): string => p.theme.text};
  }
`;

interface WatchPageProps {
  domain: string;
}

const WatchPage: FC<WatchPageProps> = ({ domain }) => {
  const router = useRouter();
  const query = router.query;
  const { videos } = useContext(VideoContext);
  const [isDropDownShown, setIsDropDownShow] = useState(false);
  const [currentVideoID, setCurrentVideoID] = useState(videos.find((_video) => _video.id === query.id)?.id);
  const video = videos.find((_video) => _video.id === currentVideoID);

  if (!video) {
    router.push("/404");
    return <></>;
  }

  const [cookies] = useCookies(["videoVolume", "isTheaterMode"]);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const isTheaterMode = booleanify(cookies.isTheaterMode);
  const [showMore, setShowMore] = useState(false);
  const ref = useRef<HTMLVideoElement & HTMLImageElement>(null);

  const sort = typeof query.sort === "string" ? (query.sort as SortType) : undefined;
  const order = typeof query.order === "string" ? (query.order as OrderType) : undefined;
  const search = typeof query.search === "string" ? query.search : undefined;
  const onlyFavorites = typeof query.onlyFavorites === "string";
  const category = typeof query.category === "string" ? query.category : undefined;
  const sortedVideos = sortVideos(videos, sort, order, search, onlyFavorites, category);
  const videoIndex = sortedVideos.findIndex((_video) => _video.id === video.id);
  const nextVideo = sortedVideos[videoIndex + 1];
  const previousVideo = sortedVideos[videoIndex - 1];

  const showMoreDetails = (): void => {
    setShowMore(true);
  };

  const showLessDetails = (): void => {
    setShowMore(false);
  };

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

  const goToNextVideo = (): void => {
    if (nextVideo) {
      setCurrentVideoID(nextVideo.id);
      navigateToVideo(nextVideo);
    }
  };
  const goToPreviousVideo = (): void => {
    if (previousVideo) {
      setCurrentVideoID(previousVideo.id);
      navigateToVideo(previousVideo);
    }
  };

  const navigateToVideo = (videoToNavigateTo: Video): void => {
    const newQuery = { ...router.query };
    delete newQuery.id;
    router.replace(
      {
        pathname: "/watch/" + videoToNavigateTo.id,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
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

  const videoSrc = `/api/watch/${video.id}.${video.extentsion}`;
  const thumbSrc = `/api/thumb/${video.id}.${video.extentsion}`;
  const fullVideoURL = `${domain}${videoSrc}`;
  const fullThumbSrc = `${domain}${thumbSrc}`;
  const url = `${domain}/watch/${video.id}`;
  const title = "Blujay · " + video.name;

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [video]);

  const options: DropDownOption[] = [{ text: "Settings", icon: "bx bx-log-out", action: (): void => {} }];
  const videoCategory = getVideoCategory(video, category);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="og:title" property="og:title" content={video.name} />
        <meta name="og:url" property="og:url" content="blah" />
        <meta name="og:type" property="og:type" content={video.mimeType} />
        <meta name="og:description" property="og:description" content={video.description} />

        {video.type === "video" ? (
          <>
            <meta name="og:video" property="og:video" content={fullVideoURL} />
            <meta name="og:video:secure_url" property="og:video:secure_url" content={fullVideoURL} />
            <meta name="og:video:type" property="og:video:type" content={video.mimeType} />
            <meta name="og:video:width" property="og:video:width" content={video.width.toString()} />
            <meta name="og:video:height" property="og:video:height" content={video.height.toString()} />
            <meta name="twitter:card" property="twitter:card" content="player" />
            <meta name="twitter:player" property="twitter:player" content={fullVideoURL} />
            <meta name="twitter:player:width" property="twitter:player:width" content={video.width.toString()} />
            <meta name="twitter:player:height" property="twitter:player:height" content={video.height.toString()} />
            <meta
              name="twitter:twitter:player:stream"
              property="twitter:twitter:player:stream"
              content={fullVideoURL}
            />
          </>
        ) : (
          <>
            <meta name="og:image" property="og:image" content={fullVideoURL} />
            <meta name="og:image:type" property="og:image:type" content={video.mimeType} />
            <meta name="og:image:url" property="og:image:url" content={fullVideoURL} />
            <meta name="og:image:width" property="og:image:width" content={video.width.toString()} />
            <meta name="og:image:height" property="og:image:height" content={video.height.toString()} />
            <meta name="og:image:alt" property="og:image:alt" content="" />
            <meta name="twitter:card" property="twitter:card" content="summary_large_image" />
          </>
        )}

        <meta name="twitter:site" property="twitter:site" content="Blujay" />
        <meta name="twitter:title" property="twitter:title" content={video.name} />
        <meta name="twitter:description" property="twitter:description" content={video.description} />
        <meta name="twitter:image" property="twitter:image" content={fullThumbSrc} />
      </Head>
      {isZoomedIn ? (
        <>
          <Overlay onClick={setZoomedOut}></Overlay>
          <OverlayImage onClick={setZoomedOut} src={videoSrc + "?isPreview=true"} draggable={false}></OverlayImage>
        </>
      ) : (
        <></>
      )}
      <VideoContainer isTheaterMode={isTheaterMode}>
        <PageOptions>
          <BackButton icon="bx bx-arrow-back" hoverTextOn="Go Back" onClick={goBack}></BackButton>
          <PeviousVideoButton
            icon="bx bx-chevron-left"
            hoverTextOn="Previous"
            onClick={goToPreviousVideo}
            disabled={!previousVideo}
          />
          <ButtonIcon icon="bx bx-chevron-right" hoverTextOn="Next" onClick={goToNextVideo} disabled={!nextVideo} />
        </PageOptions>
        <VideoWrapper>
          {isTheaterMode && <BlackOverlay />}
          {video.type === "video" ? (
            <VideoPlayer
              src={videoSrc}
              ref={ref}
              controls
              autoPlay
              playsInline
              onVolumeChange={handleVolumeChange}
              draggable={false}
            />
          ) : (
            <Image ref={ref} src={videoSrc} onClick={setZoomedIn} draggable={false} />
          )}
        </VideoWrapper>
        <VideoDetailsWrapper>
          <VideoDetails>
            <VideoMetadata>
              <h6>
                {videoCategory} · <TimeAgo date={video.uploaded} /> · {video.views} views{"  "}
                {!showMore && <MoreButton onClick={showMoreDetails}>...show more</MoreButton>}
              </h6>
            </VideoMetadata>
            {showMore && (
              <VideoMetadata>
                <h6>
                  Filename: {video.fileName} <br />
                  Dimensions: {video.width} x {video.height} <br />
                  Uploaded: {new Date(video.uploaded).toDateString()} <br />
                  Update: {new Date(video.updated).toDateString()} <br />
                  {showMore && <LessButton onClick={showLessDetails}>...show less</LessButton>}
                </h6>
              </VideoMetadata>
            )}
          </VideoDetails>
          {/* <VideoOptions>
            <Buttons>
              <FavoriteButton video={video} />
              <CopyLinkButton link={url} />
              <DownloadButton link={fullVideoURL} />
              <RequireAuthButton video={video} showText={true} />
              <TheatreModeButton />
              <VideoSettingsButton />
            </Buttons>
          </VideoOptions> */}
          <DropDown options={options} isShown={isDropDownShown} setIsShown={setIsDropDownShow} />
        </VideoDetailsWrapper>
      </VideoContainer>
    </>
  );
};

export default WatchPage;
