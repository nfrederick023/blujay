import { GetServerSideProps, NextPage } from "next";
import { OrderType, SortType, Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { authGuard, getProtectedVideoList } from "@server/utils/auth";
import { listVideos } from "@server/utils/listVideos";
import { orderOptions, sortOptions } from "@client/utils/constants";
import { sortVideos } from "@client/utils/sortVideo";
import React, { useContext, useEffect } from "react";
import WatchPage from "@client/components/pages/watch/watch";

interface WatchProps {
  selectedVideo?: Video;
  sortedVideos: Video[];
  serverVideos: Video[];
  url: string;
  params: string;
}

const Watch: NextPage<WatchProps> = ({ selectedVideo, url, sortedVideos, serverVideos, params }: WatchProps) => {
  const { videos, touched, setVideos } = useContext(VideoContext);

  useEffect(() => {
    setVideos(serverVideos);
  }, []);

  if (!selectedVideo) {
    return <></>;
  }

  return (
    <WatchPage
      selectedVideo={selectedVideo}
      url={url}
      sortedVideos={sortedVideos}
      params={params}
      videos={touched ? videos : serverVideos}
    ></WatchPage>
  );
};

export const getServerSideProps: GetServerSideProps<WatchProps> = authGuard(async (ctx) => {
  const serverVideos = await getProtectedVideoList(ctx);
  let sortedVideos = [...serverVideos];
  const videoID = ctx.query.id as string | undefined;
  const sort = ctx.query.sort as SortType | undefined;
  const order = ctx.query.order as OrderType | undefined;
  const category = ctx.query.category as string | undefined;
  const search = ctx.query.search as string | undefined;
  const isFavorites = ctx.query.isFavorites as string | undefined;
  const queryParams = new URLSearchParams({});

  const selectedVideo = serverVideos.find((video) => video.id === videoID);

  if (sort && sortOptions.includes(sort as SortType) && order && orderOptions.includes(order as OrderType)) {
    queryParams.append("sort", sort);
    queryParams.append("order", order);
    sortedVideos = sortVideos(sortedVideos, sort, order);
  }

  if (category) {
    sortedVideos = sortedVideos.filter((video) => video.category.toLowerCase() === category?.toLowerCase());
    queryParams.append("category", category);
  }

  if (isFavorites) {
    sortedVideos = sortedVideos.filter((video) => video.isFavorite);
    queryParams.append("isFavorites", isFavorites);
  }

  if (search) {
    sortedVideos = sortedVideos.filter((video) => video.name.toLowerCase().includes(search.toLowerCase()));
    queryParams.append("search", search);
  }

  let params = queryParams.toString();

  if (!params) {
    params = "";
  }

  // http://localhost:3000/watch/85818224
  const protocol = ctx.req.headers?.["x-forwarded-proto"] || "http";
  const hostname = ctx.req.headers?.["x-forwarded-host"] || ctx.req?.headers["host"];
  const url = new URL(ctx.req?.url ?? "", `${protocol}://${hostname}`).toString();

  // if no auth required
  return { props: { selectedVideo, url, sortedVideos, serverVideos, params } };
});

export default Watch;
