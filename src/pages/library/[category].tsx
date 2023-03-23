import { GetServerSideProps, NextPage } from "next";

import React from "react";

import { AuthContext } from "@client/contexts/authContext";
import { Video } from "@client/types/types";
import { listVideos } from "@server/utils/listVideos";
import CategoryPage from "@client/components/Library/Category";

interface CategoryProps {
  videos: Video[];
}

const Category: NextPage<CategoryProps> = ({ videos }: CategoryProps) => {
  const authContext = React.useContext(AuthContext);

  return (
    <>
      <CategoryPage videos={videos} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  CategoryProps
> = async () => {
  return {
    props: {
      videos: (await listVideos()).filter((video) => !video.requireAuth),
    },
  };
};

export default Category;
