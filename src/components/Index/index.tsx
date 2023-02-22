import { Video } from "@client/types/types";
import React, { FC } from "react";
import VideoSlider from "../Common/VideoSlider";

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
      <h2>Recent Videos</h2>
      <VideoSlider videos={recentVideos} />
      <h2>Recent Favorites</h2>
      <VideoSlider videos={favoritedVideos} />
      <h2>All Videos</h2>
      <VideoSlider videos={sortedVideos} />
    </>
  );
};

export default IndexPage;
