import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import ButtonIcon from "../button";
import React, { FC, useContext } from "react";

interface PublicButtonProps {
  video: Video;
}

const PublicButton: FC<PublicButtonProps> = (props) => {
  const { updateVideo } = useContext(VideoContext);

  const handleSetVisibility = (): void => {
    updateVideo({ ...props.video, requireAuth: !props.video.requireAuth });
  };

  return (
    <ButtonIcon
      isSelected={!props.video.requireAuth}
      selectedIcon="bx-globe"
      icon="bx-lock-alt"
      text="Set as Public"
      textSelected="Set as Private"
      isCondensed="condensed"
      confrimText="Private!"
      confrimTextSelected="Public!"
      onClick={handleSetVisibility}
    />
  );
};

export default PublicButton;
