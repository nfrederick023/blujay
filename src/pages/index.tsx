import { GetServerSideProps, NextPage } from "next";

import React from "react";

import { AuthContext } from "../components/Common/Providers/AuthProvider";
import { Video } from "@client/utils/types";
import { listVideos } from "@server/utils/listVideos";
import IndexPage from "@client/components/Index";

interface IndexProps {
  videos: Video[];
}

const Index: NextPage<IndexProps> = ({ videos }: IndexProps) => {
  const authContext = React.useContext(AuthContext);
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
