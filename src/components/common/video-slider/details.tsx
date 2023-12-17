import { OrderType, SortType, Video } from "@client/utils/types";
import Link from "next/link";
import React, { FC, useRef, useState } from "react";
import TimeAgo from "react-timeago";
import styled from "styled-components";

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
  aspect-ratio: 16/9;
  border-radius: 15px;
  object-fit: cover;
`;

const ImagePlayer = styled.img.attrs(thumbnailAttr)`
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 15px;
  object-fit: cover;
  position: absolute;
  opacity: 0;

  &:hover {
    opacity: 1;
  }
`;

const VideoPlayer = styled.video.attrs(thumbnailAttr)`
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 15px;
  object-fit: cover;
  position: absolute;

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
  category?: string;
  isFavorites?: boolean;
  sort?: SortType;
  order?: OrderType;
  search?: string;
}

const VideoDetails: FC<VideoDetailsProps> = ({
  video,
  category,
  isFavorites,
  sort,
  order,
  search,
}: VideoDetailsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const queryParams = new URLSearchParams({});

  if (search) {
    queryParams.append("search", search);
  }

  if (sort) {
    queryParams.append("sort", sort);
  }

  if (order) {
    queryParams.append("order", order);
  }

  if (category) {
    queryParams.append("category", category);
  }

  if (isFavorites) {
    queryParams.append("isFavorites", "true");
  }

  let params = queryParams.toString();

  if (params) {
    params = "?" + params;
  }

  return (
    <VideoDetailsWrapper ref={ref}>
      <Link href={"/watch/" + video?.id + params} draggable={false}>
        {video ? (
          <VideoDetailsContainer>
            {video.type === "video" && (
              <VideoPlayer
                ref={videoRef}
                poster={"/api/thumb/" + encodeURIComponent(video.id)}
                onMouseEnter={handleIsHoverTrueChange}
                onMouseLeave={handleIsHoverFalseChange}
                src={"/api/watch/" + encodeURIComponent(video.id) + "." + video.extentsion + "?isPreview=true"}
                disablePictureInPicture
                isPlaying={isHovering}
                preload={"none"}
                draggable={false}
                muted
                loop
              />
            )}
            {video.type === "gif" && isHovering && (
              <ImagePlayer
                onMouseEnter={handleIsHoverTrueChange}
                onMouseLeave={handleIsHoverFalseChange}
                src={"/api/watch/" + encodeURIComponent(video.id) + "." + video.extentsion + "?isPreview=true"}
                draggable={false}
              />
            )}
            <Thumbnail
              onMouseEnter={handleIsHoverTrueChange}
              src={"/api/thumb/" + encodeURIComponent(video.id)}
              draggable={false}
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
