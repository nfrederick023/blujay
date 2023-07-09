import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { listVideos } from "@server/utils/listVideos";
import FavoritesPage from "@client/components/pages/favorites/favorites";
import React from "react";

interface FavoritesProps {
  videos: Video[];
}

const Favorites: NextPage<FavoritesProps> = ({ videos }: FavoritesProps) => {
  return <FavoritesPage videos={videos} />;
};

export const getServerSideProps: GetServerSideProps<
  FavoritesProps
> = async () => {
  return {
    props: {
      videos: (await listVideos()).filter((video) => !video.requireAuth),
    },
  };
};

export default Favorites;
