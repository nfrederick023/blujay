import { KeepAliveComponenet } from "@client/utils/types";
import { NextPage } from "next";
import { withKeepAlive } from "react-next-keep-alive";
import AllPage from "@client/components/pages/all/all";
import React from "react";

const All: NextPage = () => {
  return <AllPage />;
};

export default withKeepAlive(All as KeepAliveComponenet, "all_page");
