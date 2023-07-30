import { Video } from "@client/utils/types";
import { isMediaTypeVideo } from "@client/utils/checkMediaType";
import Link from "next/link";
import React, { FC, useRef, useState } from "react";
import TimeAgo from "react-timeago";
import styled from "styled-components";
import useResizeObserver from "@react-hook/resize-observer";

const VideoDetailsWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const VideoDetailsContainer = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const PlaceHolder = styled.div`
  width: 100%;
`;

const thumbnailAttr = (p: { imageHeight: number }): unknown => ({
  style: {
    height: p.imageHeight,
  },
});

const Thumbnail = styled.img.attrs(thumbnailAttr)`
  width: 100%;
  border-radius: 15px;
  object-fit: cover;
`;

const ImagePlayer = styled.img.attrs(thumbnailAttr)`
  position: absolute;
  width: 100%;
  object-fit: cover;
  border-radius: 15px;

  opacity: 0;
  transition: opacity 0.1s ease-in-out;

  &:hover {
    opacity: 1;
  }
`;

const VideoPlayer = styled.video.attrs(thumbnailAttr)`
  position: absolute;
  width: 100%;
  border-radius: 15px;
  object-fit: cover;

  opacity: 0;
  transition: opacity 0.1s ease-in-out;

  &:hover {
    opacity: ${(p): string => {
      return p.hasLoaded ? "1" : "0";
    }};
  }
`;

const VideoNameWrapper = styled.div`
  display: grid;

  h5 {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: pre;
  }

  h6 {
    color: ${(p): string => p.theme.textContrast};
  }
`;

interface VideoDetailsProps {
  video?: Video;
}

const VideoDetails: FC<VideoDetailsProps> = ({ video }: VideoDetailsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [size, setSize] = useState(0);
  const [hasHovered, setHasHovered] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const imageHeight = (size / 1920) * 1080;
  const isVideo = isMediaTypeVideo(video?.extentsion || "");
  const isGif = video?.extentsion === "gif";

  React.useLayoutEffect(() => setSize(ref.current?.getBoundingClientRect().width || 0), [ref]);

  useResizeObserver(ref, (entry) => setSize(entry.contentRect.width));

  const handleIsHoverTrueChange = (): void => {
    if (!hasHovered) setHasHovered(true);
    if (videoRef.current && videoRef.current.paused) videoRef.current.play();
  };

  const handleIsHoverFalseChange = (): void => {
    if (videoRef.current) {
      const isPlaying =
        videoRef.current.currentTime > 0 &&
        !videoRef.current.paused &&
        !videoRef.current.ended &&
        videoRef.current.readyState > videoRef.current.HAVE_CURRENT_DATA;
      if (isPlaying) videoRef.current.pause();
    }
  };

  const triggerHasLoaded = (): void => {
    if (!hasLoaded) setHasLoaded(true);
  };

  return (
    <VideoDetailsWrapper ref={ref}>
      <Link href={"/watch/" + video?.id}>
        {video ? (
          <VideoDetailsContainer>
            {hasHovered && (
              <>
                {isVideo && (
                  <VideoPlayer
                    ref={videoRef}
                    onLoadedData={triggerHasLoaded}
                    hasLoaded={hasLoaded}
                    poster={"/api/thumb/" + encodeURIComponent(video.id)}
                    onMouseEnter={handleIsHoverTrueChange}
                    onMouseLeave={handleIsHoverFalseChange}
                    src={"/api/watch/" + encodeURIComponent(video.id) + ".mp4"}
                    imageHeight={imageHeight}
                    autoPlay
                    muted
                    loop
                  />
                )}
                {isGif && (
                  <ImagePlayer
                    imageHeight={imageHeight}
                    onMouseEnter={handleIsHoverTrueChange}
                    onMouseLeave={handleIsHoverFalseChange}
                    src={"/api/watch/" + encodeURIComponent(video.id) + ".mp4"}
                  />
                )}
              </>
            )}
            <Thumbnail
              imageHeight={imageHeight}
              onMouseEnter={handleIsHoverTrueChange}
              onMouseLeave={handleIsHoverFalseChange}
              src={"/api/thumb/" + encodeURIComponent(video.id)}
            />
            <VideoNameWrapper>
              <h5>{video.name}</h5>
              <h6>
                {video.category.length ? video.category : "All Videos"} · <TimeAgo date={video.created} />
              </h6>
            </VideoNameWrapper>
          </VideoDetailsContainer>
        ) : (
          <PlaceHolder />
        )}
      </Link>
    </VideoDetailsWrapper>
  );
};

export default VideoDetails;
