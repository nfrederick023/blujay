import { Video } from "@client/utils/types";
import Head from "next/head";
import React, { FC } from "react";

interface WatchMetaProps {
  video: Video;
  fullVideoSrc: string;
  fullThumbSrc: string;
}

const WatchMeta: FC<WatchMetaProps> = ({ video, fullVideoSrc, fullThumbSrc }) => {
  const pageTitle = "Blujay · " + video.name;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="og:title" property="og:title" content={video.name} />
      <meta name="og:url" property="og:url" content="blah" />
      <meta name="og:type" property="og:type" content={video.mimeType} />
      <meta name="og:description" property="og:description" content={video.description} />

      {video.type === "video" ? (
        <>
          <meta name="og:video" property="og:video" content={fullVideoSrc} />
          <meta name="og:video:secure_url" property="og:video:secure_url" content={fullVideoSrc} />
          <meta name="og:video:type" property="og:video:type" content={video.mimeType} />
          <meta name="og:video:width" property="og:video:width" content={video.width.toString()} />
          <meta name="og:video:height" property="og:video:height" content={video.height.toString()} />
          <meta name="twitter:card" property="twitter:card" content="player" />
          <meta name="twitter:player" property="twitter:player" content={fullVideoSrc} />
          <meta name="twitter:player:width" property="twitter:player:width" content={video.width.toString()} />
          <meta name="twitter:player:height" property="twitter:player:height" content={video.height.toString()} />
          <meta name="twitter:twitter:player:stream" property="twitter:twitter:player:stream" content={fullVideoSrc} />
        </>
      ) : (
        <>
          <meta name="og:image" property="og:image" content={fullVideoSrc} />
          <meta name="og:image:type" property="og:image:type" content={video.mimeType} />
          <meta name="og:image:url" property="og:image:url" content={fullVideoSrc} />
          <meta name="og:image:width" property="og:image:width" content={video.width.toString()} />
          <meta name="og:image:height" property="og:image:height" content={video.height.toString()} />
          <meta name="og:image:alt" property="og:image:alt" content="" />
          <meta name="twitter:card" property="twitter:card" content="summary_large_image" />
        </>
      )}

      <meta name="twitter:site" property="twitter:site" content="Blujay" />
      <meta name="twitter:title" property="twitter:title" content={video.name} />
      <meta name="twitter:description" property="twitter:description" content={video.description} />
      <meta name="twitter:image" property="twitter:image" content={fullThumbSrc} />
    </Head>
  );
};

export default WatchMeta;
