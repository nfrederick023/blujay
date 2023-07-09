import { Video } from "@client/utils/types";
import React, { FC } from "react";
import TimeAgo from "react-timeago";
import router from "next/router";
import styled from "styled-components";
import useResizeObserver from "@react-hook/resize-observer";

const VideoDetailsWrapper = styled.div`
  width: 100%;
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
    width: "100%",
    borderRadius: 15,
    objectFit: "cover",
  },
});

const Thumbnail = styled.img.attrs(thumbnailAttr)`
  width: 100%;
  border-radius: 15px;
  object-fit: cover;
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
  const ref = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState(0);
  const imageHeight = (size / 1920) * 1080;

  React.useLayoutEffect(
    () => setSize(ref.current?.getBoundingClientRect().width || 0),
    [ref]
  );

  useResizeObserver(ref, (entry) => setSize(entry.contentRect.width));

  const navigateToVideo = (): void => {
    router.push("/watch/" + video?.id);
  };

  return (
    <VideoDetailsWrapper ref={ref} onClick={navigateToVideo}>
      {video ? (
        <>
          {ref ? (
            <>
              <Thumbnail
                imageHeight={imageHeight}
                src={"/api/thumb/" + encodeURIComponent(video.id)}
              />

              <VideoNameWrapper>
                <h5>{video.name}</h5>
                <h6>
                  {video.category.length ? video.category : "All Videos"} ·{" "}
                  <TimeAgo date={video.created} />
                </h6>
              </VideoNameWrapper>
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <PlaceHolder />
      )}
    </VideoDetailsWrapper>
  );
};

export default VideoDetails;
