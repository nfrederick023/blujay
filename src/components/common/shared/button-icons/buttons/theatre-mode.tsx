import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { screenSizes } from "@client/utils/constants";
import { useCookies } from "react-cookie";
import ButtonIcon from "../button-icon";
import React, { FC } from "react";
import styled from "styled-components";

const TheatreModeButtonIcon = styled(ButtonIcon)`
  @media (max-width: ${screenSizes.smallScreenSize}px) {
    display: none;
  }
`;

const TheatreModeButton: FC = () => {
  const [cookies, setCookie] = useCookies(["isTheaterMode"]);
  const isTheaterMode = booleanify(cookies.isTheaterMode);

  const handleSetViewMode = (): void => {
    setCookie("isTheaterMode", !isTheaterMode, getCookieSetOptions());
  };

  return (
    <TheatreModeButtonIcon
      icon="bx bx-movie"
      selectedIcon="bx bx-movie"
      textOn="Theater Mode"
      isSelected={isTheaterMode}
      hoverTextOn="Close Theatre Mode"
      hoverTextOff="Open Theatre Mode"
      confrimTextOn="Opened!"
      confrimTextOff="Closed!"
      onClick={handleSetViewMode}
    />
  );
};

export default TheatreModeButton;
