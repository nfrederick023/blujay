import { AuthContext } from "@client/components/Common/Providers/AuthProvider";
import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { listVideos } from "@server/utils/listVideos";
import CategoryPage from "@client/components/Library/Category";
import React from "react";

interface CategoryProps {
  videos: Video[];
}

const Category: NextPage<CategoryProps> = ({ videos }: CategoryProps) => {
  const authContext = React.useContext(AuthContext);

  return <CategoryPage videos={videos} />;
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
