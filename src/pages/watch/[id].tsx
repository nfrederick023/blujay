import * as mime from "mime-types";
import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { checkHashedPassword } from "@server/utils/auth";
import { listVideos } from "@server/utils/listVideos";
import React from "react";
import WatchPage from "@client/components/pages/watch/watch";
import router from "next/router";

interface WatchProps {
  video?: Video;
  url: string;
}

const Watch: NextPage<WatchProps> = ({ video, url }: WatchProps) => {
  if (!video) {
    router.push("/404");
    return <></>;
  }

  return <WatchPage video={video} url={url}></WatchPage>;
};

export const getServerSideProps: GetServerSideProps<WatchProps> = async (ctx) => {
  const isAuthenticated = checkHashedPassword(ctx.req.cookies?.authToken ?? "");
  const video = (await listVideos()).find((video) => {
    return video.id === ctx.query.id;
  });

  // if the user is not authorized to view the video, redirect them
  if (video?.requireAuth && !isAuthenticated) {
    ctx.res.writeHead(302, { Location: "/401" });
    ctx.res.end();
  }

  const protocol = ctx.req.headers?.["x-forwarded-proto"] || "http";
  const hostname = ctx.req.headers?.["x-forwarded-host"] || ctx.req?.headers["host"];
  const url = new URL(ctx.req?.url ?? "", `${protocol}://${hostname}`).toString();

  // if no auth required
  return { props: { video, url } };
};

export default Watch;
