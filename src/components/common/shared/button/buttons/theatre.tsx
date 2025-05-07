import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { useCookies } from "react-cookie";
import ButtonIcon from "../button";
import React, { FC } from "react";

const TheatreButton: FC = () => {
  const [cookies, setCookie] = useCookies(["isTheaterMode"]);
  const isTheaterMode = booleanify(cookies.isTheaterMode);

  const handleSetViewMode = (): void => {
    setCookie("isTheaterMode", !isTheaterMode, getCookieSetOptions());
  };

  return (
    <ButtonIcon
      icon="bx-movie"
      selectedIcon="bx-movie"
      isSelected={isTheaterMode}
      text="Open Theatre Mode"
      textSelected="Close Theatre Mode"
      confrimText="Closed!"
      confrimTextSelected="Opened!"
      isCondensed="condensed"
      onClick={handleSetViewMode}
    />
  );
};

export default TheatreButton;
