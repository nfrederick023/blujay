import { Video } from "@client/utils/types";
import { updateVideo } from "@client/utils/api";
import ButtonIcon from "../button-icon";
import React, { FC } from "react";

interface RequireAuthButtonProps {
  video: Video;
  handleResponse: (res: Response, newVideo: Video) => unknown;
  showText: boolean;
}

const RequireAuthButton: FC<RequireAuthButtonProps> = ({ video, handleResponse, showText }) => {
  const handleSetVisibility = async (): Promise<void> => {
    const newVideo: Video = { ...video, requireAuth: !video.requireAuth };
    const res = await updateVideo(newVideo);
    handleResponse(res, newVideo);
  };

  return (
    <ButtonIcon
      isSelected={!video.requireAuth}
      selectedIcon="bx bx-globe"
      icon="bx bx-lock-alt"
      hoverTextOn="Set as Private"
      hoverTextOff="Set as Public"
      confrimTextOn="Public!"
      confrimTextOff="Private!"
      textOn={showText ? "Public" : undefined}
      textOff={showText ? "Private" : undefined}
      onClick={handleSetVisibility}
    />
  );
};

export default RequireAuthButton;
