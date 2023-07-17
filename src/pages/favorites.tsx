import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { getProtectedVideoList } from "@server/utils/auth";
import FavoritesPage from "@client/components/pages/favorites/favorites";
import React from "react";

interface FavoritesProps {
  videos: Video[];
}

const Favorites: NextPage<FavoritesProps> = ({ videos }: FavoritesProps) => {
  return <FavoritesPage videos={videos} />;
};

export const getServerSideProps: GetServerSideProps<FavoritesProps> = async (ctx) => {
  return {
    props: {
      videos: getProtectedVideoList(ctx),
    },
  };
};

export default Favorites;
