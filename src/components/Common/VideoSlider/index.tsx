import { Video } from "@client/types/types";
import React, { FC } from "react";
import styled from "styled-components";
interface IndexPageProps {
  videos: Video[];
}

const VideoSliderWrapper = styled.div`
  display: flex;
`;

const Thumbnail = styled.img`
  width: 25rem;
  margin: 15px;
`;

const VideoSlider: FC<IndexPageProps> = ({ videos }: IndexPageProps) => {
  return (
    <VideoSliderWrapper>
      {videos.map((video) => (
        <div key={`recent_${video.id}`}>
          <Thumbnail src={"/api/thumb/" + encodeURIComponent(video.id)} />
        </div>
      ))}
    </VideoSliderWrapper>
  );
};

export default VideoSlider;
