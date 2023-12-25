import React, { FC, ReactNode, useState } from "react";
import styled from "styled-components";

const FileUploadWrapper = styled.div`
  display: contents;
`;

const FileUploadInput = styled.input`
  display: none;
`;

const Overlay = styled.div`
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 7;
  animation: fadeIn 0.15s;
`;

const LabelOverlay = styled.label`
  position: inherit;
  top: inherit;
  left: inherit;
  width: inherit;
  height: inherit;
  z-index: 9;
`;

const DragDropBox = styled.div`
  z-index: 8;
  opacity: 1;
  position: fixed;
  display: flex;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 300px;
  margin-left: -250px; // half the width
  margin-top: -150px; // half the height
  color: ${(p): string => p.theme.text};
  border-radius: 15px;
`;

const UploadIcon = styled.i`
  margin: auto;
`;

const DragDropText = styled.div`
  margin: auto;
  display: grid;
  text-align: center;
`;

interface GlobalUploadWrapperProps {
  children: ReactNode;
  setFilesToUpload: React.Dispatch<React.SetStateAction<FileList | null>>;
}

const GlobalUploadWrapper: FC<GlobalUploadWrapperProps> = ({ children, setFilesToUpload }) => {
  const [isDragFile, setIsDragFile] = useState(false);
  const stopDefaults = (e: React.DragEvent | React.MouseEvent): void => {
    e.preventDefault();
  };

  const onDragOver = (e: React.DragEvent): void => {
    setIsDragFile(true);
    stopDefaults(e);
  };

  const onDragLeave = (e: React.DragEvent): void => {
    setIsDragFile(false);
    stopDefaults(e);
  };

  const onDrop = async (e: React.DragEvent): Promise<void> => {
    stopDefaults(e);
    setIsDragFile(false);

    const files = e.dataTransfer.files;
    await setFilesToUpload(files);
  };

  return (
    <FileUploadWrapper onDragOver={onDragOver}>
      <FileUploadInput type="file" id="drag-drop-file-upload" multiple />
      {children}
      {isDragFile && (
        <Overlay>
          <LabelOverlay
            htmlFor="drag-drop-file-upload"
            onDragLeave={onDragLeave}
            onClick={stopDefaults}
            onDragOver={stopDefaults}
            onDrop={onDrop}
          />
          <DragDropBox>
            <DragDropText>
              <UploadIcon className="bx bx-cloud-upload bx-lg" />
              <h5>Drop to Upload</h5>
            </DragDropText>
          </DragDropBox>
        </Overlay>
      )}
    </FileUploadWrapper>
  );
};

export default GlobalUploadWrapper;
