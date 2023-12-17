import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { authGuard, getProtectedVideoList } from "@server/utils/auth";
import FavoritesPage from "@client/components/pages/favorites/favorites";
import React, { useContext, useEffect } from "react";

interface FavoritesProps {
  serverVideos: Video[];
}

const Favorites: NextPage<FavoritesProps> = ({ serverVideos }: FavoritesProps) => {
  const { videos, touched, setVideos } = useContext(VideoContext);
  useEffect(() => {
    setVideos(serverVideos);
  }, []);
  return <FavoritesPage videos={touched ? videos : serverVideos} />;
};

export const getServerSideProps: GetServerSideProps<FavoritesProps> = authGuard(async (ctx) => {
  return {
    props: {
      serverVideos: await getProtectedVideoList(ctx),
    },
  };
});

export default Favorites;
