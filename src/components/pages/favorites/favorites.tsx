import { Video } from "@client/utils/types";
import React, { FC } from "react";
import VideoSlider from "@client/components/common/video-slider/video-slider";

interface FavoritesPageProps {
  videos: Video[];
}

const FavoritesPage: FC<FavoritesPageProps> = ({ videos }: FavoritesPageProps) => {
  const favoritedVideos = videos.filter((video) => video.isFavorite);
  return <VideoSlider videos={favoritedVideos} sliderType={"verticle"} headerText={"Favorites"} />;
};

export default FavoritesPage;
