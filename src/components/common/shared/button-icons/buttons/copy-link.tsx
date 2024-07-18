import ButtonIcon from "../button-icon";
import React, { FC } from "react";

interface CopyLinkButtonProps {
  link: string;
}

const CopyLinkButton: FC<CopyLinkButtonProps> = ({ link }) => {
  const handleCopyLink = (): void => {
    navigator.clipboard.writeText(link);
  };

  return <ButtonIcon icon="bx bx-link" onClick={handleCopyLink} hoverTextOn="Copy Link" confrimTextOn="Copied!" />;
};

export default CopyLinkButton;
