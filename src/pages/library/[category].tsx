import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { authGuard, getProtectedVideoList } from "@server/utils/auth";
import CategoryPage from "@client/components/pages/library/category/category";
import React, { useContext, useEffect } from "react";

interface CategoryProps {
  serverVideos: Video[];
}

const Category: NextPage<CategoryProps> = ({ serverVideos }: CategoryProps) => {
  const { videos, setVideos } = useContext(VideoContext);
  useEffect(() => {
    setVideos(serverVideos);
  }, []);
  return <CategoryPage videos={videos} />;
};

export const getServerSideProps: GetServerSideProps<CategoryProps> = authGuard(async (ctx) => {
  return {
    props: {
      serverVideos: await getProtectedVideoList(ctx),
    },
  };
});

export default Category;
