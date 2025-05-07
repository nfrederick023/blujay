import { TextMedium, TextSmall } from "@client/components/common/shared/text-size";
import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { getVideoCategory } from "@client/utils/sortVideo";
import { screenSizes } from "@client/utils/constants";
import ButtonIcon from "@client/components/common/shared/button/button";
import DeleteButton from "@client/components/common/shared/button/buttons/delete";
import DownloadButton from "@client/components/common/shared/button/buttons/download";
import DropDown from "@client/components/common/shared/drop-down";
import FavoriteButton from "@client/components/common/shared/button/buttons/favorite";
import LinkButton from "@client/components/common/shared/button/buttons/link";
import PublicButton from "@client/components/common/shared/button/buttons/public";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import TheatreButton from "@client/components/common/shared/button/buttons/theatre";
import TimeAgo from "@client/components/common/shared/timeago";
import styled from "styled-components";

const VideoDetailsWrapper = styled.div`
  margin: 10px 0px 0px 0px;
  overflow: hidden;

  @media (min-width: ${screenSizes.smallScreenSize}px) {
    display: flex;
  }
`;

const VideoDetails = styled.div`
  margin-bottom: 10px;
  margin-right: 10px;
  width: 100%;
  white-space: pre;
`;

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  width: 100%;

  ::-webkit-scrollbar {
    height: 0px;
  }

  & > *:first-child {
    margin-left: 1px;
  }

  & > *:last-child {
    margin-right: 1px;
  }

  @media (min-width: ${screenSizes.smallScreenSize}px) {
    min-width: fit-content;

    & > *:first-child {
      margin-left: auto;
    }
  }
`;

const VideoNameWrapper = styled.div`
  display: grid;
  align-content: center;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const VideoName = styled(TextMedium)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MetadataText = styled(TextSmall)`
  color: ${(p): string => p.theme.text};
  margin-right: 24px;
  display: flex;
`;

const ExtendedMetaData = styled.div`
  margin-top: 10px;
  border-top: 1px solid ${(p): string => p.theme.textContrast};
  padding-top: 10px;
`;

const CategoryName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CategoryAndTimeSpacer = styled.div`
  margin: 0px 5px 0px 5px;
`;

interface WatchDetailsProps {
  video: Video;
  currentUrl: string;
  category?: string;
  fullVideoSrc: string;
  navigateToVideo: (id: string) => void;
}

const WatchDetails: FC<WatchDetailsProps> = ({ video, currentUrl, category, fullVideoSrc, navigateToVideo }) => {
  const { updateVideo, deleteVideo, videos } = useContext(VideoContext);
  const [showMore, setShowMore] = useState(false);
  const [title, setTitle] = useState(video.name);
  const editTitleRef = useRef<HTMLInputElement>(null);
  const videoCategory = getVideoCategory(video, category);

  const removeCategory = (categoryToRemove: string): void => {
    updateVideo({ ...video, categories: video.categories.filter((category) => category !== categoryToRemove) });
  };

  const toggleDetails = (): void => {
    setShowMore(!showMore);
  };

  const resetViews = (): void => {
    const confirmMessage = `Are you sure you want to reset the view count for "${video.name}"?`;
    if (confirm(confirmMessage)) {
      updateVideo({ ...video, views: 0 });
    }
  };

  useEffect(() => {
    setTitle(video.name);
  }, [video]);

  const thumbnailOptions: DropDownMenu[] = [
    { text: "Upload Thumbnail", icon: "bx-upload", onClick: (): void => {} },
    { text: "Reset Thumbnail", icon: "bx-reset", onClick: (): void => {} },
    { text: "Download Thumbnail", icon: "bxs-download", onClick: (): void => {} },
  ];

  const categoryOptions: DropDownMulti[] = [...new Set(videos.flatMap((video) => video.categories))].map((c) => {
    return { text: c, selected: video.categories.includes(c) };
  });

  return (
    <div>
      <VideoDetailsWrapper>
        <VideoDetails>
          <VideoNameWrapper>
            <VideoName>{video.name}</VideoName>
          </VideoNameWrapper>
          <MetadataText>
            <VideoNameWrapper>
              <CategoryName>{videoCategory}</CategoryName>
            </VideoNameWrapper>
            <CategoryAndTimeSpacer>{"·"}</CategoryAndTimeSpacer>
            <TimeAgo date={video.uploaded} /> · {video.views} views
          </MetadataText>
        </VideoDetails>
        <Buttons>
          <FavoriteButton video={video} />
          <LinkButton link={currentUrl} />
          <DownloadButton link={fullVideoSrc} />
          <TheatreButton />
          <ButtonIcon
            icon="bx-cog"
            onClick={toggleDetails}
            isSelected={showMore}
            text="Additional Options"
            isCondensed
          />
        </Buttons>
      </VideoDetailsWrapper>
      {showMore ? (
        <ExtendedMetaData>
          <Buttons>
            <DropDown
              options={[]}
              text="Categories"
              icon="bxs-category-alt"
              type="multiselect"
              onChange={(): void => {}}
            />
            <DropDown options={thumbnailOptions} text="Thumbnail Settings" icon="bx-image-alt" type="menu" />
            <PublicButton video={video} />
            <ButtonIcon text="Edit Title" icon="bxs-edit-alt" isCondensed onClick={(): void => {}} />
            <ButtonIcon text="View Metadata" icon="bx-info-circle" isCondensed onClick={(): void => {}} />
            <DeleteButton video={video} />
          </Buttons>
          {/* <h3>Video Details</h3>
          <VideoMetadata>
            <MetadataText>
              Filename: <br />
              Dimensions: <br />
              File Size: <br />
              Uploaded: <br />
              Updated: <br />
              Mimetype: <br />
            </MetadataText>
            <MetadataText>
              <span>{video.filename}</span>
              <br />
              {video.width} x {video.height} <br />
              {prettyBytes(video.size)} <br />
              {new Date(video.uploaded).toDateString()} <br />
              {new Date(video.updated).toDateString()} <br />
              {video.mimeType} <br />
            </MetadataText>
          </VideoMetadata> */}
          {/* <Input label="Title:"></Input> */}
        </ExtendedMetaData>
      ) : (
        <></>
      )}
    </div>
  );
};

export default WatchDetails;
