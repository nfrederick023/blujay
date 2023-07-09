import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { listVideos } from "@server/utils/listVideos";
import AllPage from "@client/components/pages/all/all";
import React from "react";

interface AllProps {
  videos: Video[];
}

const All: NextPage<AllProps> = ({ videos }: AllProps) => {
  return <AllPage videos={videos} />;
};

export const getServerSideProps: GetServerSideProps<AllProps> = async () => {
  return {
    props: {
      videos: (await listVideos()).filter((video) => !video.requireAuth),
    },
  };
};

export default All;
