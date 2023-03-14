import { Video } from "@client/types/types";
import React, { FC } from "react";
import VideoThumb from "./VideoThumb";
import styled from "styled-components";

const VideoSliderWrapper = styled.div`
  display: flex;
`;

const VideoThumbWrapper = styled.div`
  width: 25rem;
  margin-right: 20px;
`;

interface VideoSliderProps {
  videos: Video[];
}

const VideoSlider: FC<VideoSliderProps> = ({ videos }: VideoSliderProps) => {
  return (
    <>
      <VideoSliderWrapper>
        {!videos.length && <>No Videos Found</>}
        {videos.map((video) => (
          <VideoThumbWrapper key={`${video.id}`}>
            <VideoThumb video={video} />
          </VideoThumbWrapper>
        ))}
      </VideoSliderWrapper>
    </>
  );
};

export default VideoSlider;
