import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { authGuard, getProtectedVideoList } from "@server/utils/auth";
import AllPage from "@client/components/pages/all/all";
import React, { useContext, useEffect } from "react";

interface AllProps {
  videos: Video[];
}

const All: NextPage<AllProps> = ({ videos }: AllProps) => {
  const videoContext = useContext(VideoContext);
  useEffect(() => {
    videoContext.setVideos(videos);
  }, []);
  return <AllPage videos={videos} />;
};

export const getServerSideProps: GetServerSideProps<AllProps> = authGuard(async (ctx) => {
  return {
    props: {
      videos: await getProtectedVideoList(ctx),
    },
  };
});

export default All;
