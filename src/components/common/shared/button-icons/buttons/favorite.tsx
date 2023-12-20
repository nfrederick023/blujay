import { Video } from "@client/utils/types";
import { updateVideo } from "@client/utils/api";
import ButtonIcon from "../button-icon";
import React, { FC } from "react";

interface FavoriteButtonProps {
  video: Video;
  handleResponse: (res: Response, newVideo: Video) => unknown;
}

const FavoriteButton: FC<FavoriteButtonProps> = ({ video, handleResponse }) => {
  const handleSetAsFavorite = async (): Promise<void> => {
    const newVideo: Video = { ...video, isFavorite: !video.isFavorite };
    const res = await updateVideo(newVideo);
    handleResponse(res, newVideo);
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
