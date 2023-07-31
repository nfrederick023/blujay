import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { authGuard, getProtectedVideoList } from "@server/utils/auth";
import CategoryPage from "@client/components/pages/library/category/category";
import React, { useContext, useEffect } from "react";

interface CategoryProps {
  videos: Video[];
}

const Category: NextPage<CategoryProps> = ({ videos }: CategoryProps) => {
  const videoContext = useContext(VideoContext);
  useEffect(() => {
    videoContext.setVideos(videos);
  }, []);
  return <CategoryPage videos={videos} />;
};

export const getServerSideProps: GetServerSideProps<CategoryProps> = authGuard(async (ctx) => {
  return {
    props: {
      videos: await getProtectedVideoList(ctx),
    },
  };
});

export default Category;
