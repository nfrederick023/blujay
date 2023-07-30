import { VideoContext } from "@client/components/common/contexts/video-context";
import React, { FC, useContext } from "react";
import VideoSlider from "@client/components/common/video-slider/video-slider";

const AllPage: FC = () => {
  const videos = useContext(VideoContext).videos;

  return <VideoSlider videos={videos} sliderType={"verticle"} headerText={"All Videos"} />;
};

export default AllPage;
