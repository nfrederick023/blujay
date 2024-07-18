import { FileUpload } from "@client/utils/types";
import React, { FC, useState } from "react";
import UploadProgressPopup from "./upload-progress-popup";
import styled from "styled-components";

const ProgressBarWrapper = styled.div`
  bottom: ${(p: { isClosed: boolean }): string => (p.isClosed ? "-60px" : "0px")};
  transition: 0.25s;
  position: fixed;
  width: fill-available;
  z-index: 2;
  height: 60px;
`;

const OpenButtonWrapper = styled.div`
  bottom: ${(p: { isClosed: boolean }): string => (p.isClosed ? "0px" : "60px")};
  transition: 0.25s;
  position: fixed;
  width: fill-available;
  z-index: 2;
  height: 25px;
  pointer-events: none;
`;

const ProgressBarContent = styled.div`
  margin: 0px auto 0px auto;
  width: 500px;
`;

const IncompleteProgress = styled.div`
  margin: 15px auto 0px auto;
  background-color: ${(p): string => p.theme.textContrast};
  width: 100%;
  max-width: 90vw;
  border-radius: 30px;
  height: 4px;
`;

const CompleteProgress = styled.div`
  background-color: ${(p): string => p.theme.highlightLight};
  width: ${(p: { totalProgress: number }): string => `${p.totalProgress}`}%;
  transition: ${(p): string => (p.totalProgress === 0 ? "0s" : "1s")} ease-out;
  border-radius: 30px;
  height: 4px;
`;

const OpenButton = styled.div`
  pointer-events: auto;
  background-color: ${(p): string => p.theme.background};
  width: 60px;
  height: 30px;
  border-radius: 15px 15px 0px 0px;
  position: sticky;
  display: flex;
  top: calc(100vh - 30px);
  margin: auto;
  z-index: 1;
`;

const ProgressBarFooter = styled.div`
  background-color: ${(p): string => p.theme.background};
  width: 100%;
  height: 60px;
  position: sticky;
  display: flex;
  user-select: none;
  z-index: 2;
`;

const Icon = styled.i`
  color: ${(p): string => p.theme.textContrast};
  font-size: 28px;

  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }
`;

const OpenIcon = styled(Icon)`
  font-size: 32px;
  margin: auto;
`;

const UploadStatusContainter = styled.div`
  margin-top: 10px;
  display: flex;
`;

const UploadText = styled.div`
  margin: auto;
  display: flex;
  white-space: pre;
`;

const ErrorText = styled.div`
  color: ${(p): string => p.theme.error};
`;

const DetailsText = styled.div`
  font-size: 12px;
  color: ${(p): string => p.theme.textContrast};
  &:hover {
    color: ${(p): string => p.theme.text};
    cursor: pointer;
  }
  margin: auto;
`;

interface UploadProgressBarProps {
  uploadedFiles: FileUpload[];
  isProgressBarShown: boolean;
  setIsProgressBarShown: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadProgressBar: FC<UploadProgressBarProps> = ({
  uploadedFiles,
  isProgressBarShown,
  setIsProgressBarShown,
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [totalUploaded, setTotalUploaded] = useState(0);
  const [uploadedThisBlock, setUploadedThisBlock] = useState(0);
  const inProgressUploads = uploadedFiles.filter((file) => file.uploadStatus === "IN_PROGESS");
  const numberOfFailures = uploadedFiles.filter((file) => file.uploadStatus === "FAILED").length;
  const numberOfSuccess = uploadedFiles.filter((file) => file.uploadStatus === "COMPLETE").length;
  const noUploading = inProgressUploads.length;
  const isUploading = noUploading > 0;

  const completedOfBlock = uploadedThisBlock >= noUploading ? uploadedThisBlock - noUploading : 0;

  if (isUploading && totalUploaded === 0) {
    setUploadedThisBlock(noUploading);
    setTotalUploaded(uploadedFiles.length);
  }

  if (isUploading && totalUploaded !== uploadedFiles.length) {
    setUploadedThisBlock(uploadedThisBlock + uploadedFiles.length - totalUploaded);
    setTotalUploaded(uploadedFiles.length);
  }

  if (!isUploading && uploadedThisBlock > 0) {
    setUploadedThisBlock(0);
  }

  const totalProgress =
    Math.trunc(
      (inProgressUploads
        .map((file) => file.progress)
        .concat(new Array<number>(completedOfBlock).fill(1))
        .reduce((a, b) => a + b, 0) /
        uploadedThisBlock) *
        100
    ) || 0;

  const toggleUploadBar = (): void => {
    setIsProgressBarShown(!isProgressBarShown);
  };

  const togglePopup = (): void => {
    setShowPopup(!showPopup);
  };

  return (
    <>
      {showPopup ? <UploadProgressPopup uploadedFiles={uploadedFiles} closePopup={togglePopup} /> : <></>}
      {uploadedFiles.length ? (
        <>
          <OpenButtonWrapper isClosed={!uploadedFiles.length || !isProgressBarShown}>
            <OpenButton>
              {!isProgressBarShown ? (
                <OpenIcon tabIndex={0} onClick={toggleUploadBar} className="bx bx-chevron-up" />
              ) : (
                <OpenIcon tabIndex={0} onClick={toggleUploadBar} className="bx bx-chevron-down" />
              )}
            </OpenButton>
          </OpenButtonWrapper>
          <ProgressBarWrapper isClosed={!uploadedFiles.length || !isProgressBarShown}>
            <ProgressBarFooter>
              <ProgressBarContent>
                <IncompleteProgress>
                  {isUploading ? (
                    <CompleteProgress totalProgress={totalProgress}></CompleteProgress>
                  ) : (
                    <CompleteProgress totalProgress={100}></CompleteProgress>
                  )}
                </IncompleteProgress>
                <UploadStatusContainter>
                  <UploadText>
                    {isUploading ? (
                      <>Uploading {inProgressUploads.length} Files...</>
                    ) : (
                      <>
                        {numberOfSuccess} Files Uploaded
                        {numberOfFailures > 0 ? (
                          <>
                            {" · "}
                            <ErrorText>{numberOfFailures} Failed!</ErrorText>
                          </>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                    <DetailsText onClick={togglePopup}> See Details</DetailsText>
                  </UploadText>
                </UploadStatusContainter>
              </ProgressBarContent>
            </ProgressBarFooter>
          </ProgressBarWrapper>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default UploadProgressBar;
