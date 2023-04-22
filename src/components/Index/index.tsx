import { Video } from "@client/utils/types";
import React, { FC } from "react";
import VideoSlider from "../Common/VideoSlider/VideoSlider";

interface IndexPageProps {
  videos: Video[];
}

const IndexPage: FC<IndexPageProps> = ({ videos }: IndexPageProps) => {
  const recentVideos = [...videos].sort((a, b) => b.created - a.created);
  const favoritedVideos = recentVideos.filter((video) => video.isFavorite);

  return (
    <>
      <VideoSlider
        videos={recentVideos}
        sliderType={"horizontal"}
        header={"Recent Videos"}
      />
      <VideoSlider
        videos={favoritedVideos}
        sliderType={"horizontal"}
        header={"Recent Favorites"}
      />
      <VideoSlider
        videos={videos}
        sliderType={"verticle"}
        header={"All Videos"}
      />
    </>
  );
};

export default IndexPage;
