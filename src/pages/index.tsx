import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { listVideos } from "@server/utils/listVideos";
import IndexPage from "@client/components/Pages/Index";
import React from "react";

interface IndexProps {
  videos: Video[];
}

const Index: NextPage<IndexProps> = ({ videos }: IndexProps) => {
  return <IndexPage {...{ videos }} />;
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  return {
    props: {
      videos: (await listVideos()).filter((video) => !video.requireAuth),
    },
  };
};

export default Index;
