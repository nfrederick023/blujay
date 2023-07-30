import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { useCookies } from "react-cookie";
import ButtonIcon from "../button-icon";
import React, { FC } from "react";

const TheatreModeButton: FC = () => {
  const [cookies, setCookie] = useCookies(["isTheaterMode", "videoVolume", "isSidebarEnabled"]);
  const isTheatreMode = booleanify(cookies.isTheaterMode);

  const handleSetViewMode = (): void => {
    setCookie("isTheaterMode", !isTheatreMode, getCookieSetOptions());
  };

  return (
    <ButtonIcon
      icon="bx bx-movie"
      selectedIcon="bx bx-movie"
      textOn="Theatre Mode"
      isSelected={isTheatreMode}
      hoverTextOn="Close Theatre Mode"
      hoverTextOff="Open Theatre Mode"
      confrimTextOn="Opened!"
      confrimTextOff="Closed!"
      onClick={handleSetViewMode}
    />
  );
};

export default TheatreModeButton;
