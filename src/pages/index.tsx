import { KeepAliveComponenet } from "@client/utils/types";
import { NextPage } from "next";
import { withKeepAlive } from "react-next-keep-alive";
import IndexPage from "@client/components/pages/index";
import React from "react";

const Index: NextPage = () => {
  return <IndexPage />;
};

export default withKeepAlive(Index as KeepAliveComponenet, "index_page");
