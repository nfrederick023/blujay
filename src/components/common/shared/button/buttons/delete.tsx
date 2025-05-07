import { Video } from "@client/utils/types";
import { VideoContext } from "@client/components/common/contexts/video-context";
import ButtonIcon from "../button";
import React, { FC, useContext } from "react";

interface DeleteButtonProps {
  video: Video;
}

const DeleteButton: FC<DeleteButtonProps> = (props) => {
  const { deleteVideo } = useContext(VideoContext);

  const onClickDeleteVideo = async (): Promise<void> => {
    const confirmMessage = `Are you sure you want to permanently delete "${props.video.filename}"?`;
    confirm(confirmMessage) && (await deleteVideo(props.video));
  };

  return (
    <ButtonIcon text="Delete" icon="bx-trash" onClick={onClickDeleteVideo} variant="error" isCondensed="condensed" />
  );
};

export default DeleteButton;
