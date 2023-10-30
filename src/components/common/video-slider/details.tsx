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
  object-fit: cover;
  border-radius: 15px;
  width: 100%;

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

  transition: opacity 0.1s ease-in-out;

  opacity: ${(p): string => {
    return p.isPlaying ? "1" : "0";
  }};
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
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const imageHeight = (size / 1920) * 1080;
  const isVideo = isMediaTypeVideo(video?.extentsion || "");
  const isGif = video?.extentsion === "gif";

  React.useLayoutEffect(() => setSize(ref.current?.getBoundingClientRect().width || 0), [ref]);

  useResizeObserver(ref, (entry) => {
    if (size !== entry.contentRect.width) {
      setSize(entry.contentRect.width);
    }
  });

  const handleIsHoverTrueChange = async (): Promise<void> => {
    setIsHovering(true);
    if (videoRef.current) {
      await videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleIsHoverFalseChange = (): void => {
    setIsHovering(false);
  };

  if (!isHovering && isPlaying) {
    videoRef.current?.pause();
  }

  return (
    <VideoDetailsWrapper ref={ref}>
      <Link href={"/watch/" + video?.id}>
        {video ? (
          <VideoDetailsContainer>
            {isVideo && (
              <VideoPlayer
                ref={videoRef}
                poster={"/api/thumb/" + encodeURIComponent(video.id)}
                onMouseEnter={handleIsHoverTrueChange}
                onMouseLeave={handleIsHoverFalseChange}
                src={"/api/watch/" + encodeURIComponent(video.id) + "." + video.extentsion}
                disablePictureInPicture
                imageHeight={imageHeight}
                isPlaying={isHovering}
                preload={"none"}
                type={"video/mp4"}
                muted
                loop
              />
            )}
            {isGif && (
              <ImagePlayer
                imageHeight={imageHeight}
                onMouseEnter={handleIsHoverTrueChange}
                onMouseLeave={handleIsHoverFalseChange}
                src={"/api/watch/" + encodeURIComponent(video.id) + "." + video.extentsion}
              />
            )}
            <Thumbnail
              imageHeight={imageHeight}
              onMouseEnter={handleIsHoverTrueChange}
              src={"/api/thumb/" + encodeURIComponent(video.id)}
            />
            <VideoNameWrapper>
              <h5>{video.name}</h5>
              <h6>
                {video.category.length ? video.category : "All Videos"} · <TimeAgo date={video.updated} />
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
