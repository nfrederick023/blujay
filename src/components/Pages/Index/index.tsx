import { VideoContext } from "@client/components/common/contexts/video-context";
import React, { FC, useContext } from "react";
import VideoSlider from "@client/components/common/video-slider/video-slider";

const IndexPage: FC = () => {
  const videos = useContext(VideoContext).videos;
  const favoritedVideos = videos.filter((video) => video.isFavorite);

  return (
    <>
      <VideoSlider videos={videos} sliderType={"horizontal"} headerText={"Recent Videos"} intialSort={"Date Created"} />
      <VideoSlider
        videos={favoritedVideos}
        sliderType={"horizontal"}
        headerText={"Recent Favorites"}
        intialSort={"Date Created"}
      />
      <VideoSlider videos={videos} sliderType={"verticle"} headerText={"All Videos"} intialSort={"Date Created"} />
    </>
  );
};

export default IndexPage;
