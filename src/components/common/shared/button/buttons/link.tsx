import ButtonIcon from "../button";
import React, { FC } from "react";

type LinkButtonProps = { link: string };

const LinkButton: FC<LinkButtonProps> = (props) => {
  const handleCopyLink = (): void => {
    navigator.clipboard.writeText(props.link);
  };

  return (
    <ButtonIcon
      icon="bx-link"
      onClick={handleCopyLink}
      text="Copy Link"
      confrimText="Copied!"
      isCondensed="condensed"
    />
  );
};

export default LinkButton;
