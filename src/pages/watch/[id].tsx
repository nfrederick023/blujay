import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { authGuard } from "@server/utils/auth";
import { listVideos } from "@server/utils/listVideos";
import React, { useContext, useEffect } from "react";
import WatchPage from "@client/components/pages/watch/watch";
import router from "next/router";

interface WatchProps {
  video?: Video;
  serverVideos: Video[];
  url: string;
}

const Watch: NextPage<WatchProps> = ({ video, url, serverVideos }: WatchProps) => {
  const { setVideos } = useContext(VideoContext);

  if (!video) {
    router.push("/404");
    return <></>;
  }

  useEffect(() => {
    setVideos(serverVideos);
  }, []);

  return <WatchPage video={video} url={url}></WatchPage>;
};

export const getServerSideProps: GetServerSideProps<WatchProps> = authGuard(async (ctx) => {
  const serverVideos = await listVideos();
  const video = serverVideos.find((video) => {
    return video.id === ctx.query.id;
  });

  // http://localhost:3000/watch/85818224
  const protocol = ctx.req.headers?.["x-forwarded-proto"] || "http";
  const hostname = ctx.req.headers?.["x-forwarded-host"] || ctx.req?.headers["host"];
  const url = new URL(ctx.req?.url ?? "", `${protocol}://${hostname}`).toString();

  // if no auth required
  return { props: { video, url, serverVideos } };
});

export default Watch;
