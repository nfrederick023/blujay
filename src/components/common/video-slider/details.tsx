import { Video } from "@client/utils/types";
import React, { FC, useState } from "react";
import TimeAgo from "react-timeago";
import styled from "styled-components";

const VideoDetailsWrapper = styled.div`
  width: 100%;
`;

const PlaceHolder = styled.div`
  width: 100%;
`;

const Thumbnail = styled.img`
  width: 100%;
  border-radius: 15px;
  object-fit: cover;
  height: ${(p: { imageHeight: number }): number => p.imageHeight}px;
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
  const [ref, setRef] = useState<HTMLDivElement | null>();

  // the purpose of this ref is to set the height of the image
  // before we know the true height aka prevents some content flash
  const imageHeight = ((ref?.offsetWidth || 0) / 1920) * 1080;

  return (
    <VideoDetailsWrapper ref={setRef}>
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
