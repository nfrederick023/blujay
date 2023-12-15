import { BluJayTheme, FileUpload } from "@client/utils/types";
import React, { FC, useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
  cursor: pointer;
`;

const PopupBox = styled.div`
  z-index: 6;
  position: fixed;
  display: flex;
  flex-wrap: wrap;
  align-content: baseline;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 510px;
  margin-left: -400px; // half the width
  margin-top: -255px; // half the height
  background-color: ${(p): string => p.theme.backgroundContrast};
  border-radius: 10px;
  padding: 20px;
  &::-webkit-scrollbar {
    width: 1px;
    background-color: rgba(0, 0, 0, 0);
  }
`;

const CloseWrapper = styled.div`
  width: 100%;
  display: flex;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 2px solid ${(p): string => p.theme.textContrast};
  margin-bottom: 8px;
  padding-bottom: 8px;
  padding-right: 15px;
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
`;

const Icon = styled.i`
  color: ${(p): string => p.theme.textContrast};
  font-size: 28px;
  margin-left: auto;

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }

  &:before {
    position: relative;
    right: 7px;
  }
`;

interface UploadProgressPopupProps {
  uploadedFiles: FileUpload[];
  closePopup: () => void;
}

const UploadProgressPopup: FC<UploadProgressPopupProps> = ({ uploadedFiles, closePopup }: UploadProgressPopupProps) => {
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

  // useEffect(() => {
  //   document.body.style.overflowY = "hidden";
  //   document.body.style.marginRight = "5px";
  //   return () => {
  //     document.body.style.overflowY = "scroll";
  //     document.body.style.marginRight = "0px";
  //   };
  // }, []);

  return (
    <>
      <Overlay onClick={closePopup} />
      <PopupBox>
        <CloseWrapper>
          <Icon onClick={closePopup} className="bx bx-x" />
        </CloseWrapper>
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
            <Item key={i} onMouseOver={setItemOnHover(file)} onMouseOut={removeItemOnHover}>
              <Filename>{file.filename}</Filename>
              <Status hasFailed={file.uploadStatus === "FAILED"}>{file.uploadStatus}</Status>
              <Progress>{formatPercentage(file)}</Progress>
            </Item>
          ))}
        </ItemWrapper>
        <ErrorWrapper>
          {hoveredItem && hoveredItem.uploadStatus === "FAILED" ? <>Error: {`"${hoveredItem.error}"`}</> : <></>}
        </ErrorWrapper>
      </PopupBox>
    </>
  );
};

export default UploadProgressPopup;