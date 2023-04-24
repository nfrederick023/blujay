import React, { FC } from "react";
import VideoSlider from "../../Common/VideoSlider/VideoSlider";

const IndexPage: FC = () => {
  return (
    <>
      <VideoSlider sliderType={"horizontal"} header={"Recent Videos"} />
      <VideoSlider sliderType={"horizontal"} header={"Recent Favorites"} />
      <VideoSlider sliderType={"verticle"} header={"All Videos"} />
    </>
  );
};

export default IndexPage;
