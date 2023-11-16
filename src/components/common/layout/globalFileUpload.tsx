import { fileExtensions } from "@client/utils/constants";
import { uploadVideo } from "@client/utils/api";
import { useRouter } from "next/router";
import React, { Dispatch, DragEvent, FC, MouseEvent, ReactNode, SetStateAction, useState } from "react";
import styled from "styled-components";

const FileUploadInput = styled.input`
  display: none;
`;

export interface GlobalFileUploadProps {
  children: ReactNode;
  setFiles: Dispatch<SetStateAction<FileList | null>>;
}

const GlobalFileUpload: FC<GlobalFileUploadProps> = ({ children, setFiles }: GlobalFileUploadProps) => {
  const [isDragFile, setIsDragFile] = useState("");
  const router = useRouter();

  const stopDefaults = (e: DragEvent | MouseEvent): void => {
    e.stopPropagation();
    e.preventDefault();
  };

  const dragEvents = {
    onDragEnter: stopDefaults,
    onDragLeave: stopDefaults,
    onDragOver: stopDefaults,
    onClick: stopDefaults,
    onDrop: (e: DragEvent): void => {
      stopDefaults(e);

      const files = e.dataTransfer.files;

      for (const file of files) {
        const ext = file.name.split(".").pop();
        if (ext && fileExtensions.includes(ext)) {
          setFiles(files);
          const formData = new FormData();
          for (const file of files) {
            formData.append("file", file);
          }
          uploadVideo(formData);
          router.push("/upload");
        } else {
          //unsupported file type
        }
      }
    },
  };

  // we validate the that file type is correct/accepted on the server as well
  const acceptedFileTypes = "image/*,video/*";

  return (
    <>
      <FileUploadInput type="file" accept={acceptedFileTypes} id="file-upload" {...dragEvents} multiple />
      <label htmlFor="file-upload" {...dragEvents}>
        {children}
      </label>
    </>
  );
};

export default GlobalFileUpload;
