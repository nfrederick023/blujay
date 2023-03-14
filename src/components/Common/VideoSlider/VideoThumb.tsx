import { Video } from "@client/types/types";
import React, { FC } from "react";
import TimeAgo from "react-timeago";
import styled from "styled-components";

const Thumbnail = styled.img`
  width: 25rem;
  border-radius: 15px;
`;

const VideoNameWrapper = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

interface VideoThumbProps {
  video: Video;
}

const VideoThumb: FC<VideoThumbProps> = ({ video }: VideoThumbProps) => {
  return (
    <>
      <Thumbnail src={"/api/thumb/" + encodeURIComponent(video.id)} />
      <VideoNameWrapper>
        <h4>{video.name}</h4>
      </VideoNameWrapper>
      <h5>
        {video.category.length ? video.category : "All Videos"} ·{" "}
        <TimeAgo date={video.created} />
      </h5>
    </>
  );
};

export default VideoThumb;
