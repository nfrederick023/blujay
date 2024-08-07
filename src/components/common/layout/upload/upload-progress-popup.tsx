import { BluJayTheme, FileUpload } from "@client/utils/types";
import Popup from "../../shared/popup";
import React, { FC, useState } from "react";
import styled from "styled-components";

const Header = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 2px solid ${(p): string => p.theme.textContrast};
  margin-bottom: 8px;
  padding-bottom: 8px;
  padding-right: 15px;
`;

const PopupContent = styled.div`
  height: 510px;
  width: 800px;
`;

const ItemWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: baseline;
  height: 380px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: none;
`;

const Item = styled.div`
  display: flex;
  width: 100%;
  padding-right: 10px;
  cursor: pointer;
`;

const Filename = styled.div`
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 20px;
`;

const Progress = styled.div`
  text-align: right;
  min-width: 80px;
`;

const Status = styled.div`
  margin-left: auto;
  text-align: left;
  min-width: 140px;
  color: ${(p: { hasFailed?: boolean; theme: BluJayTheme }): string => (p.hasFailed ? p.theme.error : "")};
`;

const ErrorWrapper = styled.div`
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface UploadProgressPopupProps {
  uploadedFiles: FileUpload[];
  closePopup: () => void;
}

const UploadProgressPopup: FC<UploadProgressPopupProps> = ({ uploadedFiles, closePopup }) => {
  const [hoveredItem, setHoveredItem] = useState<FileUpload | null>(null);
  const formatPercentage = (uploadedFile: FileUpload): string => {
    return `${Math.trunc(uploadedFile.progress * 100)}%`;
  };

  const setItemOnHover =
    (file: FileUpload): (() => void) =>
    (): void => {
      setHoveredItem(file);
    };

  const removeItemOnHover = (): void => {
    setHoveredItem(null);
  };

  const showFullErrorMessage =
    (file: FileUpload): (() => void) =>
    (): void => {
      if (file.error) {
        alert(file.error);
      }
    };

  return (
    <Popup closePopup={closePopup}>
      <PopupContent>
        <Header>
          <Filename>
            <h5>Filename</h5>
          </Filename>
          <Status>
            <h5>Status</h5>
          </Status>
          <Progress>
            <h5>Progress</h5>
          </Progress>
        </Header>
        <ItemWrapper>
          {uploadedFiles.map((file, i) => (
            <Item
              key={i}
              onMouseOver={setItemOnHover(file)}
              onMouseOut={removeItemOnHover}
              onClick={showFullErrorMessage(file)}
            >
              <Filename>{file.filename}</Filename>
              <Status hasFailed={file.uploadStatus === "FAILED"}>{file.uploadStatus}</Status>
              <Progress>{formatPercentage(file)}</Progress>
            </Item>
          ))}
        </ItemWrapper>
        <ErrorWrapper>
          {hoveredItem && hoveredItem.uploadStatus === "FAILED" ? <>Error: {`"${hoveredItem.error}"`}</> : <></>}
        </ErrorWrapper>
      </PopupContent>
    </Popup>
  );
};

export default UploadProgressPopup;
