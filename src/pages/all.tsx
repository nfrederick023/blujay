import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { getProtectedVideoList } from "@server/utils/auth";
import AllPage from "@client/components/pages/all/all";
import React from "react";

interface AllProps {
  videos: Video[];
}

const All: NextPage<AllProps> = ({ videos }: AllProps) => {
  return <AllPage videos={videos} />;
};

export const getServerSideProps: GetServerSideProps<AllProps> = async (ctx) => {
  return {
    props: {
      videos: getProtectedVideoList(ctx),
    },
  };
};

export default All;
