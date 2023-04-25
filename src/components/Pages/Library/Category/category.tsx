"use client";
import { useRouter } from "next/router";
import React, { FC } from "react";
import VideoSlider from "../../../Common/VideoSlider/VideoSlider";

const CategoryPage: FC = () => {
  const router = useRouter();
  const { category } = router.query;

  // const categoryVideos = videos.filter((video) => {
  //   if (!Array.isArray(category))
  //     return video.category.toLowerCase() === category?.toLowerCase();
  // });

  //const cateogryName = categoryVideos[0]?.category ?? category;

  return <VideoSlider sliderType={"verticle"} header={"tets"} />;
};

export default CategoryPage;
