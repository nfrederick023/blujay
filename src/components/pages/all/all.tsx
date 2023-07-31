import { Video } from "@client/utils/types";
import React, { FC } from "react";
import VideoSlider from "@client/components/common/video-slider/video-slider";

interface AllPageProps {
  videos: Video[];
}

const AllPage: FC<AllPageProps> = ({ videos }: AllPageProps) => {
  return <VideoSlider videos={videos} sliderType={"verticle"} headerText={"All Videos"} />;
};

export default AllPage;
