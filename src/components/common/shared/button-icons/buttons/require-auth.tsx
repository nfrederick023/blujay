import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import ButtonIcon from "../button-icon";
import React, { FC, useContext } from "react";

interface RequireAuthButtonProps {
  video: Video;
  showText: boolean;
}

const RequireAuthButton: FC<RequireAuthButtonProps> = ({ video, showText }) => {
  const { updateVideo } = useContext(VideoContext);

  const handleSetVisibility = (): void => {
    const newVideo: Video = { ...video, requireAuth: !video.requireAuth };
    updateVideo(newVideo);
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
