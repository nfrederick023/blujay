import { Video } from "@client/utils/types";
import ButtonIcon from "@client/components/common/shared/button-icons/button-icon";
import Popup from "@client/components/common/shared/popup";
import React, { FC } from "react";
import styled from "styled-components";

const PopupContent = styled.div`
  height: 500px;
  width: 700px;
  max-width: 75vw;
  max-height: 75vh;
`;

const PreviewWrapper = styled.div`
  aspect-ratio: 16 / 9;
  background-color: black;
  justify-content: center;
  margin: 0px auto 10px auto;
  display: flex;
  user-select: none;
`;

const Preview = styled.img`
  height: 100%;
`;

const Options = styled.div`
  display: flex;

  & > *:not(:last-child) {
    margin-right: 6px;
    margin-bottom: 6px;
  }
`;

interface ThumnailPopupProps {
  togglePopup: () => void;
  selectedVideo: Video;
}

const ThumnailPopup: FC<ThumnailPopupProps> = ({ selectedVideo, togglePopup }) => {
  const thumbnailURL = "/api/thumb/" + encodeURIComponent(selectedVideo.id);

  const onClosePopup = (): void => {
    togglePopup();
  };

  const openInNewTab = (): void => {
    window.open(thumbnailURL, "_blank");
  };

  const download = (): void => {
    const link = document.createElement("a");
    link.href = thumbnailURL;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Popup closePopup={onClosePopup}>
      <PopupContent>
        <PreviewWrapper>
          <Preview src={thumbnailURL} />
        </PreviewWrapper>
        <Options>
          <ButtonIcon icon="bx bx-upload" textOn="Upload Thumbnail" />
          <ButtonIcon icon="bx bx-reset" textOn="Reset Thumbnail" />
          <ButtonIcon icon="bx bxs-download" onClick={download} />
          <ButtonIcon icon="bx bx-link-external" onClick={openInNewTab} />
        </Options>
      </PopupContent>
    </Popup>
  );
};

export default ThumnailPopup;
