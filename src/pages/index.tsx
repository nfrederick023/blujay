import { GetServerSideProps, NextPage } from "next";

import React from "react";

import { Video } from "@client/utils/types";
import { listVideos } from "@server/utils/listVideos";
import IndexPage from "@client/components/Pages/Index";

interface IndexProps {
  videos: Video[];
}

const Index: NextPage = () => {
  return <IndexPage />;
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  return {
    props: {
      videos: (await listVideos()).filter((video) => !video.requireAuth),
    },
  };
};

export default Index;
