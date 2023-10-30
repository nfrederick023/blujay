import { Video } from "@client/utils/types";
import React, { FC } from "react";
import VideoSlider from "@client/components/common/video-slider/video-slider";

interface IndexPageProps {
  videos: Video[];
}

const IndexPage: FC<IndexPageProps> = ({ videos }: IndexPageProps) => {
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
      />
      <VideoSlider videos={videos} sliderType={"verticle"} headerText={"All Videos"} intialSort={"Date Uploaded"} />
    </>
  );
};

export default IndexPage;
