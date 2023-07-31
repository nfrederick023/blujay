import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { authGuard, getProtectedVideoList } from "@server/utils/auth";
import IndexPage from "@client/components/pages/index";
import React, { useContext, useEffect } from "react";

interface IndexProps {
  videos: Video[];
}

const Index: NextPage<IndexProps> = ({ videos }: IndexProps) => {
  const videoContext = useContext(VideoContext);
  useEffect(() => {
    videoContext.setVideos(videos);
  }, []);
  return <IndexPage videos={videos} />;
};

export const getServerSideProps: GetServerSideProps<IndexProps> = authGuard(async (ctx) => {
  return {
    props: {
      videos: await getProtectedVideoList(ctx),
    },
  };
});

export default Index;
