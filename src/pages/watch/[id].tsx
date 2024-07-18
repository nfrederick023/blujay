import { GetServerSideProps, NextPage, Redirect } from "next";
import React from "react";
import WatchPage from "@client/components/pages/watch/watch";

interface WatchProps {
  domain: string;
}

const Watch: NextPage<WatchProps> = ({ domain }: WatchProps) => {
  return <WatchPage domain={domain} />;
};

export const getServerSideProps: GetServerSideProps<WatchProps | Redirect> = async (ctx) => {
  const url = ctx.req.headers.host || "";
  const protocol = ctx.req.headers["x-forwarded-proto"];
  const domain = protocol + "://" + url;
  return { props: { domain } };
};

export default Watch;
