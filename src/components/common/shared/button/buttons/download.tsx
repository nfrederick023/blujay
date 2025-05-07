import ButtonIcon from "../button";
import React, { FC } from "react";

interface CopyLinkButtonProps {
  link: string;
}

const DownloadButton: FC<CopyLinkButtonProps> = (props) => {
  return (
    <a href={props.link} download tabIndex={-1}>
      <ButtonIcon icon="bxs-download" text="Download" isCondensed="condensed" confrimText="Downloading!" />
    </a>
  );
};

export default DownloadButton;
