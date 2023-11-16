import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { authGuard, getProtectedVideoList } from "@server/utils/auth";
import React, { useContext, useEffect } from "react";
import UploadPage from "@client/components/pages/upload/upload";

interface UploadProps {
  serverVideos: Video[];
}

const Upload: NextPage<UploadProps> = ({ serverVideos }: UploadProps) => {
  const { setVideos } = useContext(VideoContext);
  useEffect(() => {
    setVideos(serverVideos);
  }, []);
  return <UploadPage />;
};

export const getServerSideProps: GetServerSideProps<UploadProps> = authGuard(async (ctx) => {
  return {
    props: {
      serverVideos: await getProtectedVideoList(ctx),
    },
  };
});

export default Upload;
