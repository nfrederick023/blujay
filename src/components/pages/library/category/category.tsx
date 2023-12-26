import { VideoContext } from "@client/components/common/contexts/video-context";
import { useRouter } from "next/router";
import React, { FC, useContext } from "react";
import VideoSlider from "@client/components/common/video-slider/video-slider";

const CategoryPage: FC = () => {
  const router = useRouter();
  const { videos } = useContext(VideoContext);
  const { category } = router.query;

  if (!category || Array.isArray(category)) {
    router.push("/404");
    return <></>;
  }

  const categoryVideos = videos.filter((video) =>
    video.categories.map((cate) => cate.toLowerCase()).includes(category.toLowerCase())
  );

  const cateogryName =
    categoryVideos[0].categories.find((cate) => cate.toLowerCase() === cate.toLowerCase()) ?? category;

  return <VideoSlider videos={categoryVideos} sliderType={"verticle"} headerText={cateogryName} category={category} />;
};

export default CategoryPage;
