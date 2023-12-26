import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import ButtonIcon from "../button-icon";
import React, { FC, useContext } from "react";

interface FavoriteButtonProps {
  video: Video;
}

const FavoriteButton: FC<FavoriteButtonProps> = ({ video }) => {
  const { updateVideo } = useContext(VideoContext);

  const handleSetAsFavorite = (): void => {
    const newVideo: Video = { ...video, isFavorite: !video.isFavorite };
    updateVideo(newVideo);
  };

  return (
    <ButtonIcon
      icon="bx bx-heart"
      selectedIcon="bx bxs-heart"
      onClick={handleSetAsFavorite}
      isSelected={video.isFavorite}
      hoverTextOn="Remove as Favorite"
      hoverTextOff="Add as Favorite"
      confrimTextOn="Added!"
      confrimTextOff="Removed!"
    />
  );
};

export default FavoriteButton;
