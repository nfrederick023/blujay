import { Video } from "@client/utils/types";
import { useRouter } from "next/router";
import React, { FC } from "react";
import VideoSlider from "../Common/VideoSlider/VideoSlider";

interface CategoryPageProps {
  videos: Video[];
}

const CategoryPage: FC<CategoryPageProps> = ({ videos }: CategoryPageProps) => {
  const router = useRouter();
  const { category } = router.query;

  const categoryVideos = videos.filter((video) => {
    if (!Array.isArray(category))
      return video.category.toLowerCase() === category?.toLowerCase();
  });

  const cateogryName = categoryVideos[0]?.category ?? category;

  return (
    <VideoSlider
      videos={categoryVideos}
      sliderType={"verticle"}
      header={cateogryName}
    />
  );
};

export default CategoryPage;
