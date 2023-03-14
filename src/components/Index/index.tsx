import { Video } from "@client/types/types";
import GradientText from "../Common/Styled/GradientText";
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
      <GradientText>
        <h2>Recent Videos</h2>
      </GradientText>
      <VideoSlider videos={recentVideos} />
      <GradientText>
        <h2>Recent Favorites</h2>
      </GradientText>
      <VideoSlider videos={favoritedVideos} />
      <GradientText>
        <h2>All Videos</h2>
      </GradientText>
      <VideoSlider videos={sortedVideos} />
      <GradientText>
        <h2>All Videos</h2>
      </GradientText>
      <VideoSlider videos={sortedVideos} />
      <GradientText>
        <h2>All Videos</h2>
      </GradientText>
      <VideoSlider videos={sortedVideos} />
      <GradientText>
        <h2>All Videos</h2>
      </GradientText>
      <VideoSlider videos={sortedVideos} />
    </>
  );
};

export default IndexPage;
