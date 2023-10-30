import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { authGuard, getProtectedVideoList } from "@server/utils/auth";
import IndexPage from "@client/components/pages/index";
import React, { useContext, useEffect } from "react";

interface IndexProps {
  serverVideos: Video[];
}

const Index: NextPage<IndexProps> = ({ serverVideos }: IndexProps) => {
  const { videos, setVideos } = useContext(VideoContext);
  useEffect(() => {
    setVideos(serverVideos);
  }, []);
  return <IndexPage videos={videos} />;
};

export const getServerSideProps: GetServerSideProps<IndexProps> = authGuard(async (ctx) => {
  return {
    props: {
      serverVideos: await getProtectedVideoList(ctx),
    },
  };
});

export default Index;
