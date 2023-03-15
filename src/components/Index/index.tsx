import { Video } from "@client/types/types";
import Gradient from "../Common/Styled/Gradient";
import React, { FC } from "react";
import VideoSlider from "../Common/VideoSlider/VideoSlider";

interface IndexPageProps {
  videos: Video[];
}

const IndexPage: FC<IndexPageProps> = ({ videos }: IndexPageProps) => {
  const recentVideos = [...videos].sort(
    ({ created: a }, { created: b }) => b - a
  );

  const sortedVideos = [...videos].sort(
    ({ name: a }, { name: b }) => Number(b) - Number(a)
  );

  const favoritedVideos = videos.filter((video) => video.isFavorite);

  return (
    <>
      <Gradient type="text">
        <h2>Recent Videos</h2>
      </Gradient>
      <VideoSlider videos={recentVideos} sliderType={"horizontal"} />
      <Gradient type="text">
        <h2>Recent Favorites</h2>
      </Gradient>
      <VideoSlider videos={favoritedVideos} sliderType={"horizontal"} />
      <Gradient type="text">
        <h2>All Videos</h2>
      </Gradient>
      <VideoSlider videos={sortedVideos} sliderType={"verticle"} />
    </>
  );
};

export default IndexPage;
