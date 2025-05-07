import { OrderType, SortType } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { booleanify } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/constants";
import { sortVideos } from "@client/utils/sortVideo";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import BackButton from "@client/components/common/shared/button/buttons/back";
import ButtonIcon from "@client/components/common/shared/button/button";
import NavButton from "@client/components/common/shared/button/buttons/nav";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import WatchDetails from "./watch-details";
import WatchMeta from "./watch-meta";
import styled from "styled-components";

const VideoContainer = styled.div<{ isTheaterMode: boolean }>`
  margin: auto;
  max-width: ${(p): string => (p.isTheaterMode ? "75%" : "55%")};

  @media (max-width: ${screenSizes.smallScreenSize}px) {
    max-width: unset;
  }
`;

const BlackOverlay = styled.div`
  position: absolute;
  background: black;
  width: 120vw;
  height: calc(100cqw / 16 * 9);
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
  user-select: none;
`;

const VideoWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: black;
  container-type: inline-size;
  line-height: 0;
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
  width: 95%;
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
  margin-bottom: 10px;
`;

const BackButtonWrapper = styled.div`
  margin-right: auto;
`;

interface WatchPageProps {
  domain: string;
}

const WatchPage: FC<WatchPageProps> = () => {
  const router = useRouter();
  const query = router.query;
  const { videos } = useContext(VideoContext);
  const [currentVideoID, setCurrentVideoID] = useState(videos.find((_video) => _video.id === query.id)?.id);
  const video = videos.find((_video) => _video.id === currentVideoID);
  const [cookies] = useCookies(["videoVolume", "isTheaterMode"]);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<undefined | string>();
  const isTheaterMode = booleanify(cookies.isTheaterMode);
  const ref = useRef<HTMLVideoElement & HTMLImageElement>(null);
  const sort = typeof query.sort === "string" ? (query.sort as SortType) : undefined;
  const order = typeof query.order === "string" ? (query.order as OrderType) : undefined;
  const search = typeof query.search === "string" ? query.search : undefined;
  const onlyFavorites = typeof query.onlyFavorites === "string";
  const category = typeof query.category === "string" ? query.category : undefined;
  const sortedVideos = sortVideos(videos, sort, order, search, onlyFavorites, category);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const videoIndex = sortedVideos.findIndex((_video) => _video.id === video?.id);
  const nextVideo = sortedVideos[videoIndex + 1];
  const previousVideo = sortedVideos[videoIndex - 1];

  const handleVolumeChange = (): void => {
    //
  };

  const toggleZoom = (): void => {
    setIsZoomedIn(!isZoomedIn);
  };

  const goToNextExistingVideo = (): void => {
    if (nextVideo) {
      goToNextVideo();
    } else if (previousVideo) {
      goToPreviousVideo();
    } else {
      router.push("/");
    }
  };

  const goToNextVideo = (): void => {
    if (nextVideo) {
      navigateToVideo(nextVideo.id);
    }
  };

  const goToPreviousVideo = (): void => {
    if (previousVideo) {
      navigateToVideo(previousVideo.id);
    }
  };

  const navigateToVideo = (id: string): void => {
    setCurrentVideoID(id);
    const newQuery = { ...router.query };
    delete newQuery.id;
    router.replace(
      {
        pathname: "/watch/" + id,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleKeyDown = (e: KeyboardEvent): void => {
    const key = e.key;
    if (document.activeElement === document.body || document.activeElement === ref.current) {
      if (key === "ArrowRight") {
        goToNextVideo();
      }

      if (key === "ArrowLeft") {
        goToPreviousVideo();
      }
    }
  };

  // const setViewThumbnail = (): void => {
  //   setIsViewThumbnail(true);
  // };

  // const setUnviewThumbnail = (): void => {
  //   setIsViewThumbnail(false);
  // };

  // the required distance between touchStart and touchEnd to be detected as a swipe

  const onTouchStart = (e: React.TouchEvent): void => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent): void => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (): void => {
    const minSwipeDistance = 10;
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextVideo();
    }
    if (isRightSwipe) {
      goToPreviousVideo();
    }
  };

  useEffect(() => {
    if (typeof query.id === "string") {
      setCurrentVideoID(query.id);
    }
  }, [router]);

  useEffect(() => {
    // conditions if a video is deleted
    if (currentVideoID && !video) {
      goToNextExistingVideo();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [video]);

  useEffect(() => {
    if (!video) {
      router.replace("/404");
    }

    setCurrentDomain(window.location.origin);
  }, []);

  if (video) {
    const videoSrc = `/api/watch/${video.id}.${video.extentsion}`;
    const thumbSrc = `/api/thumb/${video.id}.${video.extentsion}`;
    const fullVideoSrc = `${currentDomain}${videoSrc}`;
    const fullThumbSrc = `${currentDomain}${thumbSrc}`;
    const currentUrl = `${currentDomain}/watch/${video.id}`;

    return (
      <>
        {currentDomain && <WatchMeta video={video} fullThumbSrc={fullThumbSrc} fullVideoSrc={fullVideoSrc} />}
        {isZoomedIn && (
          <>
            <Overlay onClick={toggleZoom}></Overlay>
            <OverlayImage onClick={toggleZoom} src={videoSrc + "?isPreview=true"} draggable={false}></OverlayImage>
          </>
        )}
        <VideoContainer isTheaterMode={isTheaterMode}>
          <PageOptions>
            <BackButtonWrapper>
              <BackButton />
            </BackButtonWrapper>
            <NavButton onClick={goToPreviousVideo} isDisabled={!previousVideo} type="previous" />
            <NavButton onClick={goToNextVideo} isDisabled={!nextVideo} />
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
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              />
            ) : (
              <Image
                ref={ref}
                src={videoSrc}
                onClick={toggleZoom}
                draggable={false}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                tabIndex={0}
              />
            )}
          </VideoWrapper>
          <WatchDetails
            video={video}
            currentUrl={currentUrl}
            category={category}
            fullVideoSrc={fullVideoSrc}
            navigateToVideo={navigateToVideo}
          />
        </VideoContainer>
      </>
    );
  } else {
    return <></>;
  }
};

export default WatchPage;
