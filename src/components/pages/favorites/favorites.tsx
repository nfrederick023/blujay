import { VideoContext } from "@client/components/common/contexts/video-context";
import React, { FC, useContext } from "react";
import VideoSlider from "@client/components/common/video-slider/video-slider";

const FavoritesPage: FC = () => {
  const { videos } = useContext(VideoContext);
  const favoritedVideos = videos.filter((video) => video.isFavorite);
  return <VideoSlider videos={favoritedVideos} sliderType={"verticle"} headerText={"Favorites"} onlyFavorites />;
};

export default FavoritesPage;
