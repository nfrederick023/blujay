import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { getProtectedVideoList } from "@server/utils/auth";
import CategoryPage from "@client/components/pages/library/category/category";
import React from "react";

interface CategoryProps {
  videos: Video[];
}

const Category: NextPage<CategoryProps> = ({ videos }: CategoryProps) => {
  return <CategoryPage videos={videos} />;
};

export const getServerSideProps: GetServerSideProps<CategoryProps> = async (ctx) => {
  return {
    props: {
      videos: getProtectedVideoList(ctx),
    },
  };
};

export default Category;
