import { booleanify, getCookieSetOptions } from "@client/utils/cookie";
import { useCookies } from "react-cookie";
import ButtonIcon from "../button-icon";
import React, { FC } from "react";

const VideoSettingsButton: FC = () => {
  const [cookies, setCookie] = useCookies(["isEditor"]);
  const isEditor = booleanify(cookies.isEditor);

  const setEditorMode = (): void => {
    setCookie("isEditor", !isEditor, getCookieSetOptions());
  };
  return (
    <ButtonIcon
      icon="bx bxs-edit"
      textOn="Edit"
      selectedIcon="bx bxs-edit"
      hoverTextOn="Disable Editor Mode"
      confrimTextOn="Enabled!"
      hoverTextOff="Enable Editor Mode"
      confrimTextOff="Disabled!"
      isSelected={isEditor}
      onClick={setEditorMode}
    />
  );
};

export default VideoSettingsButton;
