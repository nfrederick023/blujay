import { FileUpload } from "@client/utils/types";
import { fileExtensions } from "@client/utils/constants";
import { uploadVideo } from "@client/utils/api";
import React, { FC, useEffect, useRef, useState } from "react";
import UploadProgressBar from "./upload-progress-bar";

type Status = "FAILED" | "COMPLETE";
type StatusList = { status: Status; error: string };

export interface UploadProgressProps {
  filesToUpload: FileList | null;
  setFilesToUpload: React.Dispatch<React.SetStateAction<FileList | null>>;
  isProgressBarShown: boolean;
  setIsProgressBarShown: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadProgress: FC<UploadProgressProps> = ({
  filesToUpload,
  setFilesToUpload,
  isProgressBarShown,
  setIsProgressBarShown,
}) => {
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
    if (uploadedFiles.length < 1 && !isProgressBarShown) {
      setIsProgressBarShown(true);
    }

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
    <UploadProgressBar
      uploadedFiles={uploadedFiles}
      isProgressBarShown={isProgressBarShown}
      setIsProgressBarShown={setIsProgressBarShown}
    />
  );
};

export default UploadProgress;
