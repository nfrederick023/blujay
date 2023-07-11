import * as mime from "mime-types";
import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { listVideos } from "@server/utils/listVideos";
import React from "react";
import WatchPage from "@client/components/pages/watch/watch";
import router from "next/router";

interface WatchProps {
  video?: Video;
  url: string;
  mimeType?: string;
}

const Watch: NextPage<WatchProps> = ({ video, url, mimeType }: WatchProps) => {
  if (!video || !mimeType) {
    router.push("/404");
    return <></>;
  }

  return <WatchPage video={video} url={url} mimeType={mimeType}></WatchPage>;
};

export const getServerSideProps: GetServerSideProps<WatchProps> = async (
  ctx
) => {
  const videoList = await listVideos();
  const video = videoList.find((video) => {
    return video.id === ctx.query.id;
  });

  const protocol = ctx.req?.headers?.["x-forwarded-proto"] || "http";
  const hostname =
    ctx.req?.headers?.["x-forwarded-host"] || ctx.req?.headers["host"];
  const url = new URL(
    ctx.req?.url ?? "",
    `${protocol}://${hostname}`
  ).toString();

  const mimeType = video ? (mime.lookup(video.fileName) as string) : undefined;

  // if no auth required
  return { props: { video, url, mimeType } };
};

export default Watch;
