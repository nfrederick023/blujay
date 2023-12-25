import ButtonIcon from "../button-icon";
import React, { FC } from "react";

interface CopyLinkButtonProps {
  link: string;
}

const DownloadButton: FC<CopyLinkButtonProps> = ({ link }) => {
  return (
    <a href={link} download>
      <ButtonIcon icon="bx bxs-download" hoverTextOn="Download" confrimTextOn="Downloading!" />
    </a>
  );
};

export default DownloadButton;
