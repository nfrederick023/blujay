import { VideoContext } from "@client/components/common/contexts/video-context";
import KeepAlive from "@client/components/common/shared/keep-alive";
import React, { FC, useContext } from "react";
import VideoSlider from "@client/components/common/video-slider/video-slider";

const IndexPage: FC = () => {
  const { videos } = useContext(VideoContext);
  const favoritedVideos = videos.filter((video) => video.isFavorite);

  return (
    <>
      <VideoSlider
        videos={videos}
        sliderType={"horizontal"}
        headerText={"Recent Videos"}
        intialSort={"Date Uploaded"}
      />
      <VideoSlider
        videos={favoritedVideos}
        sliderType={"horizontal"}
        headerText={"Recent Favorites"}
        intialSort={"Date Uploaded"}
        onlyFavorites
      />
      <VideoSlider videos={videos} sliderType={"verticle"} headerText={"All Videos"} intialSort={"Alphabetical"} />
    </>
  );
};

export default IndexPage;
