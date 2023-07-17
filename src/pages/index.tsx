import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { getProtectedVideoList } from "@server/utils/auth";
import { listVideos } from "@server/utils/listVideos";
import IndexPage from "@client/components/pages/index";
import React from "react";

interface IndexProps {
  videos: Video[];
}

const Index: NextPage<IndexProps> = ({ videos }: IndexProps) => {
  return <IndexPage {...{ videos }} />;
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async (ctx) => {
  return {
    props: {
      videos: getProtectedVideoList(ctx),
    },
  };
};

export default Index;
