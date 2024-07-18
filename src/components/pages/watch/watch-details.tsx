import { DropDownOption, Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import { getVideoCategory } from "@client/utils/sortVideo";
import { screenSizes } from "@client/utils/constants";
import ButtonIcon from "@client/components/common/shared/button-icons/button-icon";
import CategoryPopup from "./popups/category-popup";
import ClipButton from "@client/components/common/shared/button-icons/buttons/clip";
import CopyLinkButton from "@client/components/common/shared/button-icons/buttons/copy-link";
import DownloadButton from "@client/components/common/shared/button-icons/buttons/download";
import DropDown from "@client/components/common/shared/drop-down";
import FavoriteButton from "@client/components/common/shared/button-icons/buttons/favorite";
import React, { FC, useContext, useEffect, useRef, useState } from "react";
import RequireAuthButton from "@client/components/common/shared/button-icons/buttons/require-auth";
import ScrollContainer from "react-indiana-drag-scroll";
import TextField from "@client/components/common/shared/text-field";
import TheatreModeButton from "@client/components/common/shared/button-icons/buttons/theatre-mode";
import TimeAgo from "react-timeago";
import prettyBytes from "pretty-bytes";
import styled from "styled-components";
import ThumnailPopup from "./popups/thumbnail-popup";

const VideoDetailsWrapper = styled.div`
  margin: 10px 0px 0px 0px;
  overflow: hidden;

  @media (min-width: ${screenSizes.mediumScreenSize}px) {
    display: flex;
  }
`;

const VideoDetails = styled.div`
  margin-right: 10px;
  width: 100%;
`;

const VideoMetadata = styled.div`
  display: flex;
  text-wrap: wrap;
  margin-bottom: 10px;
`;

const VideoOptions = styled.div`
  margin-bottom: 10px;
  display: flex;
  height: fit-content;
  cursor: default;
  @media (min-width: ${screenSizes.mediumScreenSize}px) {
    min-width: fit-content;
  }
`;

const Buttons = styled.div`
  display: flex;
  overflow-x: auto;
  ::-webkit-scrollbar {
    height: 0px;
  }

  margin-right: 5px;
  height: 38px;
  & > *:not(:last-child) {
    margin-right: 6px;
    margin-bottom: 6px;
  }
`;

const VideoNameWrapper = styled.div`
  height: 38px;
  display: grid;
  align-content: center;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const VideoName = styled.h4`
  cursor: pointer;
  word-break: break-all;
`;

const ViewHideButton = styled.span`
  cursor: pointer;
  margin-left: 5px;
  color: ${(p): string => p.theme.textContrastLight};

  &:hover {
    color: ${(p): string => p.theme.text};
  }
`;

const MetadataText = styled.h6`
  color: ${(p): string => p.theme.text};
  margin-right: 24px;
`;

const SimpleMetadata = styled.div`
  margin-bottom: 10px;
`;

const CogIcon = styled(ButtonIcon)`
  pointer-events: ${(p: { isFocused: boolean }): string => (p.isFocused ? "none" : "auto")};
  cursor: ${(p): string => (p.isFocused ? "default" : "pointer")};
`;

const CogWrapper = styled.div`
  display: grid;
`;

const ExtendedMetaData = styled.div`
  border-top: 1px solid ${(p): string => p.theme.textContrast};
  padding-top: 10px;
  margin-bottom: 10px;
`;

const AbsoluteOverlay = styled.div`
  position: absolute;
`;

interface WatchDetailsProps {
  video: Video;
  currentUrl: string;
  category?: string;
  fullVideoSrc: string;
  goToNextExistingVideo: () => void;
  navigateToVideo: (id: string) => void;
}

const WatchDetails: FC<WatchDetailsProps> = ({
  video,
  currentUrl,
  category,
  fullVideoSrc,
  goToNextExistingVideo,
  navigateToVideo,
}) => {
  const { updateVideo, deleteVideo, renameFile } = useContext(VideoContext);
  const [isDropDownShown, setIsDropDownShow] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingFilename, setIsEditingFilename] = useState(false);
  const [isEditingCategories, setIsEditingCategories] = useState(false);
  const [isEditingThumbnail, setIsEditingThumbnail] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [title, setTitle] = useState(video.name);
  const [filename, setFilename] = useState(video.filename);
  const editTitleRef = useRef<HTMLInputElement>(null);
  const editFilenameRef = useRef<HTMLInputElement>(null);
  const videoCategory = getVideoCategory(video, category);

  const stopPropgation = (e: React.KeyboardEvent): void => {
    e.stopPropagation();
  };

  const toggleOnEditingTitle = async (): Promise<void> => {
    setIsEditingTitle(true);
  };

  const toggleOffEditingTitle = async (): Promise<void> => {
    if (isEditingTitle && title !== video.name) {
      await updateVideo({ ...video, name: title });
    }
    setIsEditingTitle(false);
  };

  const toggleOnEditingFilename = (): void => {
    if (!showMore) {
      setShowMore(true);
    }
    setIsEditingFilename(true);
  };

  const toggleOffEditingFilename = async (): Promise<void> => {
    setIsEditingFilename(false);
    const confirmMessage = "Warning! Renaming the file will change the ID and URL. Are you sure you want to continue?";
    if (isEditingFilename && filename !== video.filename && confirm(confirmMessage)) {
      const newVideo = await renameFile(video, filename);
      if (newVideo) {
        navigateToVideo(newVideo.id);
      }
    } else {
      setFilename(video.filename);
    }
  };

  const blurFilenameTextFile = (): void => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const toggleEditingCategories = (): void => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setIsEditingCategories(!isEditingCategories);
  };

  const toggleEditingThumbnail = (): void => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setIsEditingThumbnail(!isEditingThumbnail);
  };

  const setSetTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setTitle(e.currentTarget.value);
  };

  const setSetFilename = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    setFilename(e.currentTarget.value);
  };

  const showDropDown = (): void => {
    setIsDropDownShow(true);
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

  const deletevideo = async (): Promise<void> => {
    const confirmMessage = `Are you sure you want to permanently delete "${video.filename}"?`;
    if (confirm(confirmMessage) && (await deleteVideo(video))) {
      goToNextExistingVideo();
    }
  };

  useEffect(() => {
    setTitle(video.name);
    setFilename(video.filename);
  }, [video]);

  useEffect(() => {
    if (isEditingTitle) {
      editTitleRef.current?.focus();
    }

    if (isEditingFilename) {
      editFilenameRef.current?.focus();
    }
  }, [isEditingTitle, isEditingFilename]);

  const options: DropDownOption[] = [
    { text: "Change Title", icon: "bx bxs-edit-alt", action: toggleOnEditingTitle },
    { text: "Change Filename", icon: "bx bxs-file", action: toggleOnEditingFilename },
    { text: "Thumbnail Settings", icon: "bx bxs-image-alt", action: toggleEditingThumbnail },
    { text: "Edit Category", icon: "bx bxs-category", action: toggleEditingCategories },
    { text: "Reset Views", icon: "bx bx-reset", action: resetViews },
    { text: "Delete", icon: "bx bx-trash", action: deletevideo, color: "red" },
  ];

  return (
    <VideoDetailsWrapper>
      {isEditingCategories && <CategoryPopup togglePopup={toggleEditingCategories} selectedVideo={video} />}
      {isEditingThumbnail && <ThumnailPopup togglePopup={toggleEditingThumbnail} selectedVideo={video} />}
      <VideoDetails>
        <VideoNameWrapper>
          {isEditingTitle ? (
            <TextField
              onChange={setSetTitle}
              innerRef={editTitleRef}
              value={title}
              type={"text"}
              placeholder={""}
              onBlur={toggleOffEditingTitle}
              onEnter={toggleOffEditingTitle}
              onKeyDown={stopPropgation}
            />
          ) : (
            <VideoName onDoubleClick={toggleOnEditingTitle}>{video.name}</VideoName>
          )}
        </VideoNameWrapper>
        <SimpleMetadata>
          <MetadataText>
            {videoCategory} · <TimeAgo date={video.uploaded} /> · {video.views} views{"  "}
            {!showMore && <ViewHideButton onClick={toggleDetails}>...show details</ViewHideButton>}
          </MetadataText>
        </SimpleMetadata>
        {showMore && (
          <ExtendedMetaData>
            <VideoMetadata>
              <MetadataText>
                Filename: <br />
                Dimensions: <br />
                File Size: <br />
                Uploaded: <br />
                Updated: <br />
                Mimetype: <br />
                <ViewHideButton onClick={toggleDetails}>...hide details</ViewHideButton>
              </MetadataText>
              <MetadataText>
                {isEditingFilename ? (
                  <AbsoluteOverlay>
                    <TextField
                      onChange={setSetFilename}
                      innerRef={editFilenameRef}
                      value={filename}
                      type={"text"}
                      placeholder={""}
                      onBlur={toggleOffEditingFilename}
                      onEnter={blurFilenameTextFile}
                      onKeyDown={stopPropgation}
                    />
                  </AbsoluteOverlay>
                ) : (
                  <span onDoubleClick={toggleOnEditingFilename}>{video.filename}</span>
                )}
                <br />
                {video.width} x {video.height} <br />
                {prettyBytes(video.size)} <br />
                {new Date(video.uploaded).toDateString()} <br />
                {new Date(video.updated).toDateString()} <br />
                {video.mimeType} <br />
              </MetadataText>
            </VideoMetadata>
          </ExtendedMetaData>
        )}
      </VideoDetails>
      <VideoOptions>
        <Buttons>
          <FavoriteButton video={video} />
          <CopyLinkButton link={currentUrl} />
          <DownloadButton link={fullVideoSrc} />
          <RequireAuthButton video={video} showText={true} />
          <TheatreModeButton />
          <ButtonIcon icon="bx bxs-share" textOn="Share" />
          <CogIcon
            isFocused={isDropDownShown}
            icon="bx bx-cog"
            selectedIcon="bx bx-cog"
            hoverTextOn="Options"
            onClick={showDropDown}
            isSelected={isDropDownShown}
          />
        </Buttons>
        <CogWrapper>
          <DropDown
            options={options}
            isShown={isDropDownShown}
            setIsShown={setIsDropDownShow}
            top={45}
            left={0}
            relativePosition="left"
          />
        </CogWrapper>
      </VideoOptions>
    </VideoDetailsWrapper>
  );
};

export default WatchDetails;
