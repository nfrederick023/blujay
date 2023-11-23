import { GetServerSideProps, NextPage } from "next";
import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { authGuard } from "@server/utils/auth";
import { listVideos } from "@server/utils/listVideos";
import React, { useContext, useEffect } from "react";
import WatchPage from "@client/components/pages/watch/watch";

interface WatchProps {
  videoID?: string;
  serverVideos: Video[];
  url: string;
}

const Watch: NextPage<WatchProps> = ({ videoID, url, serverVideos }: WatchProps) => {
  const { setVideos } = useContext(VideoContext);
  const video = serverVideos.find((video) => {
    return video.id === videoID;
  });

  useEffect(() => {
    setVideos(serverVideos);
  }, []);

  if (!video) {
    return <></>;
  }

  return <WatchPage video={video} url={url}></WatchPage>;
};

export const getServerSideProps: GetServerSideProps<WatchProps> = authGuard(async (ctx) => {
  const serverVideos = await listVideos();
  const videoID = ctx.query.id as string | undefined;

  // http://localhost:3000/watch/85818224
  const protocol = ctx.req.headers?.["x-forwarded-proto"] || "http";
  const hostname = ctx.req.headers?.["x-forwarded-host"] || ctx.req?.headers["host"];
  const url = new URL(ctx.req?.url ?? "", `${protocol}://${hostname}`).toString();

  // if no auth required
  return { props: { videoID, url, serverVideos } };
});

export default Watch;
