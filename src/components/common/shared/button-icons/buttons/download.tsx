import ButtonIcon from "../button-icon";
import React, { FC } from "react";
import styled from "styled-components";

const StyledAnchor = styled.a`
  &:focus-visible {
    outline: 0px;
  }
`;

interface CopyLinkButtonProps {
  link: string;
}

const DownloadButton: FC<CopyLinkButtonProps> = ({ link }) => {
  return (
    <StyledAnchor href={link} download>
      <ButtonIcon icon="bx bxs-download" hoverTextOn="Download" confrimTextOn="Downloading!" />
    </StyledAnchor>
  );
};

export default DownloadButton;
