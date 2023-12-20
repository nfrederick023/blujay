import { FileUpload } from "@client/utils/types";
import { fileExtensions } from "@client/utils/constants";
import { uploadVideo } from "@client/utils/api";
import React, { DragEvent, FC, MouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import UploadProgressBar from "./upload-progress-bar";
import styled from "styled-components";

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

type Status = "FAILED" | "COMPLETE";
type StatusList = { status: Status; error: string };

export interface GlobalFileUploadProps {
  children: ReactNode;
  filesToUpload: FileList | null;
  setFilesToUpload: React.Dispatch<React.SetStateAction<FileList | null>>;
}

const GlobalFileUpload: FC<GlobalFileUploadProps> = ({ children, filesToUpload, setFilesToUpload }) => {
  const [isDragFile, setIsDragFile] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [statusList, setStatusList] = useState<StatusList[]>([]);
  const uploadedFilesRef = useRef<FileUpload[]>([]);
  uploadedFilesRef.current = uploadedFiles;

  const statusListRef = useRef<StatusList[]>([]);
  statusListRef.current = statusList;

  const unsavedChange = (): boolean => {
    return !!uploadedFilesRef.current.find((file) => file.uploadStatus === "IN_PROGESS");
  };

  const upload = async (files: FileList): Promise<void> => {
    // do a simple client side file type check
    for (const file of files) {
      const ext = file.name.split(".").pop();
      if (!ext || !fileExtensions.includes(ext)) {
        alert("Unsupported File Type");
        return;
      }
    }

    setUploadedFiles([
      ...uploadedFilesRef.current,
      ...Array.from(files).map(
        (file): FileUpload => ({
          filename: file.name,
          progress: 0,
          uploadStatus: "IN_PROGESS",
          error: "",
        })
      ),
    ]);

    const statusArr: StatusList[] = [];
    const currIndex = uploadedFilesRef.current.length;
    await Promise.all(
      Array.from(files).map(async (file, i) => {
        const index = currIndex + i;
        try {
          await uploadVideo(file, (progress: number) => {
            setUploadedFiles(uploadedFilesRef.current.map((f, i) => (index === i ? { ...f, progress } : f)));
          });
          statusArr[index] = { status: "COMPLETE", error: "" };
          setUploadedFiles(
            uploadedFilesRef.current.map((f, i) => (index === i ? { ...f, uploadStatus: "COMPLETE", progress: 1 } : f))
          );
        } catch (e) {
          const error = e as unknown as string;
          statusArr[index] = { status: "FAILED", error };
          setUploadedFiles(
            uploadedFilesRef.current.map((f, i) =>
              index === i ? { ...f, uploadStatus: "FAILED", progress: 1, error } : f
            )
          );
        }
      })
    );

    // sometimes the upload is so fast the progress/status isn't persisted properly, so here we fix any after upload
    const newStatus = [...statusListRef.current];
    statusArr.forEach((uploadStatus, i) => (newStatus[i] = uploadStatus));
    setStatusList(newStatus);
  };

  const stopDefaults = (e: DragEvent | MouseEvent): void => {
    e.preventDefault();
  };

  const onDragOver = (e: DragEvent): void => {
    setIsDragFile(true);
    stopDefaults(e);
  };

  const onDragLeave = (e: DragEvent): void => {
    setIsDragFile(false);
    stopDefaults(e);
  };

  const onDrop = async (e: DragEvent): Promise<void> => {
    stopDefaults(e);
    setIsDragFile(false);

    const files = e.dataTransfer.files;
    await upload(files);
  };

  if (uploadedFiles.find((file, i) => statusList[i] && file.uploadStatus !== statusList[i].status)) {
    // sometimes the upload is so fast the progress/status isn't persisted properly, so here we fix any after upload
    setUploadedFiles(
      uploadedFiles.map((file, i) => ({
        ...file,
        uploadStatus: statusList[i].status,
        error: statusList[i].error,
        progress: 1,
      }))
    );
  }

  useEffect(() => {
    if (filesToUpload) {
      setFilesToUpload(null);
      upload(filesToUpload);
    }
  }, [filesToUpload]);

  useEffect(() => {
    // warns the user if an upload is in progress
    window.onbeforeunload = (): string | void => {
      if (unsavedChange()) {
        return "You have unsaved changes. Do you really want to leave?";
      }
    };
  }, []);

  return (
    <div>
      <FileUploadInput type="file" id="drag-drop-file-upload" multiple />
      <div onDragOver={onDragOver}>
        <UploadProgressBar uploadedFiles={uploadedFiles} />

        {children}
      </div>
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
    </div>
  );
};

export default GlobalFileUpload;
