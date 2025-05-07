import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import ButtonIcon from "../button";
import React, { FC, useContext } from "react";

interface FavoriteButtonProps {
  video: Video;
}

const FavoriteButton: FC<FavoriteButtonProps> = (props) => {
  const { updateVideo } = useContext(VideoContext);

  const handleSetAsFavorite = (): void => {
    updateVideo({ ...props.video, isFavorite: !props.video.isFavorite });
  };

  return (
    <ButtonIcon
      icon="bx-heart"
      selectedIcon="bxs-heart"
      onClick={handleSetAsFavorite}
      isSelected={props.video.isFavorite}
      text="Add as Favorite"
      textSelected="Remove as Favorite"
      confrimText="Removed!"
      confrimTextSelected="Added!"
      isCondensed="condensed"
    />
  );
};

export default FavoriteButton;
