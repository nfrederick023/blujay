import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { authGuard, getProtectedVideoList } from "@server/utils/auth";
import FavoritesPage from "@client/components/pages/favorites/favorites";
import React, { useContext, useEffect } from "react";

interface FavoritesProps {
  videos: Video[];
}

const Favorites: NextPage<FavoritesProps> = ({ videos }: FavoritesProps) => {
  const videoContext = useContext(VideoContext);
  useEffect(() => {
    videoContext.setVideos(videos);
  }, []);
  return <FavoritesPage videos={videos} />;
};

export const getServerSideProps: GetServerSideProps<FavoritesProps> = authGuard(async (ctx) => {
  return {
    props: {
      videos: await getProtectedVideoList(ctx),
    },
  };
});

export default Favorites;
