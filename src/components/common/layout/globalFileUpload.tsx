import { supportedFileExtensions } from "@client/utils/constants";
import { useRouter } from "next/router";
import React, { DragEvent, FC, MouseEvent, ReactNode, useState } from "react";
import styled from "styled-components";

const FileUploadInput = styled.input``;

export interface GlobalFileUploadProps {
  children: ReactNode;
}

const GlobalFileUpload: FC<GlobalFileUploadProps> = ({ children }: GlobalFileUploadProps) => {
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
    // onClick: stopDefaults,
    onDrop: (e: DragEvent): void => {
      console.log(e);
      stopDefaults(e);

      const files = e.dataTransfer.files;

      for (const file of files) {
        const ext = file.name.split(".").pop();
        if (ext && supportedFileExtensions.includes(ext)) {
          router.push("/upload", { files: files });
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
