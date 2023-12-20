import { VideoContext } from "@client/components/common/contexts/video-context";
import { useRouter } from "next/router";
import React, { FC, useContext } from "react";
import VideoSlider from "@client/components/common/video-slider/video-slider";

const CategoryPage: FC = () => {
  const router = useRouter();
  const { videos } = useContext(VideoContext);
  const { category } = router.query;
  const isArr = !Array.isArray(category);

  const categoryVideos = videos.filter((video) => {
    if (isArr) return video.category.toLowerCase() === category?.toLowerCase();
  });

  const cateogryName = categoryVideos[0]?.category ?? category;

  return (
    <VideoSlider
      videos={categoryVideos}
      sliderType={"verticle"}
      headerText={cateogryName}
      category={isArr ? category : undefined}
    />
  );
};

export default CategoryPage;
