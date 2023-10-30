import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { authGuard, getProtectedVideoList } from "@server/utils/auth";
import AllPage from "@client/components/pages/all/all";
import React, { useContext, useEffect } from "react";

interface AllProps {
  serverVideos: Video[];
}

const All: NextPage<AllProps> = ({ serverVideos }: AllProps) => {
  const { videos, setVideos } = useContext(VideoContext);
  useEffect(() => {
    setVideos(serverVideos);
  }, []);
  return <AllPage videos={videos} />;
};

export const getServerSideProps: GetServerSideProps<AllProps> = authGuard(async (ctx) => {
  return {
    props: {
      serverVideos: await getProtectedVideoList(ctx),
    },
  };
});

export default All;
