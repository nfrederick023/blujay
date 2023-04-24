import { ConfigContext } from "../Providers/ConfigProvider";
import { Video } from "@client/utils/types";
import ContrastText from "../Styled/ContrastText";
import React, { FC, useEffect, useRef, useState } from "react";
import TimeAgo from "react-timeago";
import styled from "styled-components";

const VideoDetailsWrapper = styled.div`
  width: 100%;
`;

const PlaceHolder = styled.div`
  width: inherit;
`;

const PlaceHolderImage = styled.div`
  width: 100%;
  border-radius: 15px;

  height: ${(p: { height: number; loaded: boolean }): number =>
    p.loaded ? 0 : p.height}px;
  background: ${(p): string => p.theme.backgroundContrast};
`;

const Thumbnail = styled.img`
  width: 100%;
  border-radius: 15px;

  height: ${(p: { imageHeight: number; loaded: boolean }): number =>
    p.imageHeight}px;
  display: ${(p): string => (p.loaded ? "block" : "none")};
`;

const VideoNameWrapper = styled.div`
  display: grid;

  h5 {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: pre;
  }
`;

interface VideoDetailsProps {
  video?: Video;
}

const VideoDetails: FC<VideoDetailsProps> = ({ video }: VideoDetailsProps) => {
  const config = React.useContext(ConfigContext);
  const [loaded, setLoaded] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>();
  const [width, setwidth] = useState(0);
  const imageHeight =
    (width / config.thumbnailSettings.width) * config.thumbnailSettings.height;

  useEffect((): (() => void) => {
    const observer = new ResizeObserver((entries) => {
      setwidth(entries[0].contentRect.width);
    });
    if (ref) observer.observe(ref);
    return () => ref && observer.unobserve(ref);
  }, [ref]);

  return (
    <VideoDetailsWrapper>
      {video ? (
        <>
          <PlaceHolder ref={setRef} />

          <Thumbnail
            loaded={loaded}
            imageHeight={imageHeight}
            src={"/api/thumb/" + encodeURIComponent(video.id)}
            onLoad={(): void => {
              setLoaded(true);
            }}
          />
          <PlaceHolderImage height={imageHeight} loaded={loaded} />

          <VideoNameWrapper>
            <h5>{video.name}</h5>
          </VideoNameWrapper>
          <ContrastText type={"regular"}>
            <h6>
              {video.category.length ? video.category : "All Videos"} ·{" "}
              <TimeAgo date={video.created} />
            </h6>
          </ContrastText>
        </>
      ) : (
        <PlaceHolder />
      )}
    </VideoDetailsWrapper>
  );
};

export default VideoDetails;
