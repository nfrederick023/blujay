import { Video } from "@client/types/types";
import ContrastText from "../Styled/ContrastText";
import React, { FC } from "react";
import TimeAgo from "react-timeago";
import styled from "styled-components";

const VideoDetailsWrapper = styled.div`
  width: 100%;
  padding-right: 15px;
  &:last-child {
    padding-right: 0px;
  }
`;

const PlaceHolder = styled.div`
  width: inherit;
`;

const Thumbnail = styled.img`
  width: inherit;
  border-radius: 15px;
`;

const VideoNameWrapper = styled.div`
  display: grid;

  h5 {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: pre;
  }
`;

interface VideoDetailsProps {
  video: Video;
}

const VideoDetails: FC<VideoDetailsProps> = ({ video }: VideoDetailsProps) => {
  return (
    <VideoDetailsWrapper>
      {video ? (
        <>
          <Thumbnail src={"/api/thumb/" + encodeURIComponent(video.id)} />
          <VideoNameWrapper>
            <h5>{video.name}</h5>
          </VideoNameWrapper>
          <ContrastText type={"regular"}>
            <h6>
              {video.category.length ? video.category : "All Videos"} ·{" "}
              <TimeAgo date={video.created} />
            </h6>
          </ContrastText>
        </>
      ) : (
        <PlaceHolder />
      )}
    </VideoDetailsWrapper>
  );
};

export default VideoDetails;
